let state = 'landing'; // 'landing', 'quiz', 'results', 'progress'
let currentQuestion = 0;
let scores = {
  empathy: 0,
  skills: 0,
  independence: 0,
  wisdom: 0,
  creativity: 0
};
let randomizedQuestions = [];
let answers = []; // Array to store user answers (index of selected option per question)
let progress = 0; // For progress bar animation

const questions = [
  { text: "How do you handle conflict?", options: [
    { text: "I mediate and seek understanding", traits: { empathy: 2, wisdom: 1 } },
    { text: "I strategize and take decisive action", traits: { skills: 2, independence: 1 } },
    { text: "I stand my ground and fight if needed", traits: { independence: 2, creativity: 1 } },
    { text: "I use humor to diffuse tension", traits: { creativity: 2, empathy: 1 } }
  ]},
  { text: "What motivates you most?", options: [
    { text: "Helping others grow and succeed", traits: { empathy: 2, skills: 1 } },
    { text: "Discovering new ideas or places", traits: { independence: 2, creativity: 1 } },
    { text: "Mastering a craft or skill", traits: { skills: 2, wisdom: 1 } },
    { text: "Creating something unique", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you approach leadership?", options: [
    { text: "By inspiring and guiding others", traits: { wisdom: 2, empathy: 1 } },
    { text: "By setting a clear vision and rules", traits: { independence: 2, wisdom: 1 } },
    { text: "By adapting and innovating", traits: { creativity: 2, skills: 1 } },
    { text: "By supporting and nurturing the team", traits: { empathy: 2, independence: 1 } }
  ]},
  { text: "What’s your approach to learning?", options: [
    { text: "I study deeply to understand", traits: { wisdom: 2, skills: 1 } },
    { text: "I experiment and figure it out", traits: { creativity: 2, independence: 1 } },
    { text: "I seek guidance from others", traits: { empathy: 2, wisdom: 1 } },
    { text: "I dive in and learn by doing", traits: { independence: 2, skills: 1 } }
  ]},
  { text: "How do you spend your free time?", options: [
    { text: "Helping friends or family", traits: { empathy: 2, independence: 1 } },
    { text: "Exploring new places or ideas", traits: { independence: 2, creativity: 1 } },
    { text: "Working on a creative project", traits: { creativity: 2, skills: 1 } },
    { text: "Reflecting or reading", traits: { wisdom: 2, empathy: 1 } }
  ]},
  { text: "How do you react to failure?", options: [
    { text: "I learn and move forward", traits: { wisdom: 2, independence: 1 } },
    { text: "I try a new approach", traits: { creativity: 2, skills: 1 } },
    { text: "I support others through it", traits: { empathy: 2, wisdom: 1 } },
    { text: "I push harder next time", traits: { independence: 2, skills: 1 } }
  ]},
  { text: "What’s your ideal role in a group?", options: [
    { text: "The leader who sets the tone", traits: { independence: 2, wisdom: 1 } },
    { text: "The supporter who helps", traits: { empathy: 2, skills: 1 } },
    { text: "The idea generator", traits: { creativity: 2, independence: 1 } },
    { text: "The planner who organizes", traits: { skills: 2, wisdom: 1 } }
  ]},
  { text: "How do you make decisions?", options: [
    { text: "Based on logic and experience", traits: { wisdom: 2, skills: 1 } },
    { text: "By trusting my instincts", traits: { independence: 2, creativity: 1 } },
    { text: "By considering others’ feelings", traits: { empathy: 2, wisdom: 1 } },
    { text: "By weighing all possibilities", traits: { skills: 2, independence: 1 } }
  ]},
  { text: "What inspires you in others?", options: [
    { text: "Their kindness and care", traits: { empathy: 2, wisdom: 1 } },
    { text: "Their boldness and freedom", traits: { independence: 2, creativity: 1 } },
    { text: "Their skill and dedication", traits: { skills: 2, wisdom: 1 } },
    { text: "Their imagination and vision", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you handle stress?", options: [
    { text: "I reflect and find peace", traits: { wisdom: 2, empathy: 1 } },
    { text: "I take action to fix it", traits: { independence: 2, skills: 1 } },
    { text: "I channel it into something creative", traits: { creativity: 2, independence: 1 } },
    { text: "I talk it out with someone", traits: { empathy: 2, wisdom: 1 } }
  ]},
  { text: "What’s your biggest strength?", options: [
    { text: "My ability to connect with people", traits: { empathy: 2, independence: 1 } },
    { text: "My innovative thinking", traits: { creativity: 2, skills: 1 } },
    { text: "My determination and focus", traits: { independence: 2, wisdom: 1 } },
    { text: "My knowledge and insight", traits: { wisdom: 2, skills: 1 } }
  ]},
  { text: "How do you view rules?", options: [
    { text: "They’re guides to improve", traits: { wisdom: 2, skills: 1 } },
    { text: "I bend them if needed", traits: { independence: 2, creativity: 1 } },
    { text: "I respect them for harmony", traits: { empathy: 2, wisdom: 1 } },
    { text: "I challenge them for progress", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "What’s your approach to helping others?", options: [
    { text: "I teach them what I know", traits: { wisdom: 2, skills: 1 } },
    { text: "I encourage their independence", traits: { independence: 2, empathy: 1 } },
    { text: "I listen and support them", traits: { empathy: 2, wisdom: 1 } },
    { text: "I inspire them with ideas", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you approach risk?", options: [
    { text: "I weigh it carefully", traits: { wisdom: 2, skills: 1 } },
    { text: "I embrace it for growth", traits: { independence: 2, creativity: 1 } },
    { text: "I take it to help others", traits: { empathy: 2, independence: 1 } },
    { text: "I turn it into opportunity", traits: { creativity: 2, skills: 1 } }
  ]},
  { text: "What’s your favorite type of challenge?", options: [
    { text: "Solving complex problems", traits: { wisdom: 2, skills: 1 } },
    { text: "Exploring the unknown", traits: { independence: 2, creativity: 1 } },
    { text: "Helping someone in need", traits: { empathy: 2, wisdom: 1 } },
    { text: "Creating something new", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you express yourself?", options: [
    { text: "Through thoughtful words", traits: { wisdom: 2, empathy: 1 } },
    { text: "Through bold actions", traits: { independence: 2, skills: 1 } },
    { text: "Through art or innovation", traits: { creativity: 2, independence: 1 } },
    { text: "Through care for others", traits: { empathy: 2, wisdom: 1 } }
  ]},
  { text: "What’s your ideal legacy?", options: [
    { text: "A wiser, better world", traits: { wisdom: 2, empathy: 1 } },
    { text: "A life of freedom and adventure", traits: { independence: 2, creativity: 1 } },
    { text: "A masterpiece I created", traits: { creativity: 2, skills: 1 } },
    { text: "A community I supported", traits: { empathy: 2, independence: 1 } }
  ]},
  { text: "How do you view authority?", options: [
    { text: "It’s earned through wisdom", traits: { wisdom: 2, skills: 1 } },
    { text: "I question it often", traits: { independence: 2, creativity: 1 } },
    { text: "It’s a tool for good", traits: { empathy: 2, wisdom: 1 } },
    { text: "I’d rather lead than follow", traits: { independence: 2, skills: 1 } }
  ]},
  { text: "What drives your ambition?", options: [
    { text: "Making a difference", traits: { empathy: 2, wisdom: 1 } },
    { text: "Achieving personal freedom", traits: { independence: 2, creativity: 1 } },
    { text: "Perfecting my abilities", traits: { skills: 2, wisdom: 1 } },
    { text: "Building something lasting", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you recharge?", options: [
    { text: "Spending time alone thinking", traits: { wisdom: 2, independence: 1 } },
    { text: "Being with loved ones", traits: { empathy: 2, wisdom: 1 } },
    { text: "Working on a passion project", traits: { creativity: 2, skills: 1 } },
    { text: "Exploring new experiences", traits: { independence: 2, creativity: 1 } }
  ]},
  { text: "What’s your approach to tradition?", options: [
    { text: "I honor what works", traits: { wisdom: 2, skills: 1 } },
    { text: "I break it for progress", traits: { independence: 2, creativity: 1 } },
    { text: "I adapt it for others", traits: { empathy: 2, wisdom: 1 } },
    { text: "I reinvent it creatively", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "How do you define success?", options: [
    { text: "Inner peace and understanding", traits: { wisdom: 2, empathy: 1 } },
    { text: "Freedom and autonomy", traits: { independence: 2, creativity: 1 } },
    { text: "Mastery of my craft", traits: { skills: 2, wisdom: 1 } },
    { text: "A legacy of innovation", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "What’s your role in a crisis?", options: [
    { text: "The calm voice of reason", traits: { wisdom: 2, empathy: 1 } },
    { text: "The one taking charge", traits: { independence: 2, skills: 1 } },
    { text: "The creative problem-solver", traits: { creativity: 2, independence: 1 } },
    { text: "The helper who comforts", traits: { empathy: 2, wisdom: 1 } }
  ]},
  { text: "How do you view competition?", options: [
    { text: "A chance to improve", traits: { skills: 2, wisdom: 1 } },
    { text: "A test of my will", traits: { independence: 2, creativity: 1 } },
    { text: "A way to unite people", traits: { empathy: 2, wisdom: 1 } },
    { text: "A spark for new ideas", traits: { creativity: 2, independence: 1 } }
  ]},
  { text: "What’s your ultimate goal?", options: [
    { text: "To guide and uplift others", traits: { empathy: 2, wisdom: 1 } },
    { text: "To live life on my terms", traits: { independence: 2, creativity: 1 } },
    { text: "To achieve excellence", traits: { skills: 2, wisdom: 1 } },
    { text: "To create something timeless", traits: { creativity: 2, independence: 1 } }
  ]}
];

const archetypes = [
  { name: "King", desc: "Balanced leadership with wisdom and independence.", traits: { wisdom: 0.4, independence: 0.3, empathy: 0.1, skills: 0.1, creativity: 0.1 } },
  { name: "Father", desc: "Nurturing and guiding with wisdom and skills.", traits: { wisdom: 0.4, skills: 0.3, empathy: 0.2, independence: 0.1, creativity: 0.0 } },
  { name: "Warrior", desc: "Courageous and disciplined, valuing independence and creativity.", traits: { independence: 0.4, creativity: 0.3, skills: 0.2, wisdom: 0.1, empathy: 0.0 } },
  { name: "Magician", desc: "Transformative and insightful, blending empathy and creativity.", traits: { creativity: 0.4, empathy: 0.3, wisdom: 0.2, skills: 0.1, independence: 0.0 } },
  { name: "Lover", desc: "Passionate and connected, cherishing independence and wisdom.", traits: { independence: 0.4, wisdom: 0.3, empathy: 0.2, creativity: 0.1, skills: 0.0 } },
  { name: "Sage", desc: "Knowledgeable and reflective, focused on wisdom and creativity.", traits: { wisdom: 0.5, creativity: 0.3, empathy: 0.1, independence: 0.1, skills: 0.0 } },
  { name: "Explorer", desc: "Adventurous and free, driven by independence.", traits: { independence: 0.5, creativity: 0.2, skills: 0.2, wisdom: 0.1, empathy: 0.0 } },
  { name: "Creator", desc: "Innovative and imaginative, prioritizing creativity.", traits: { creativity: 0.5, independence: 0.2, skills: 0.2, empathy: 0.1, wisdom: 0.0 } },
  { name: "Hero", desc: "Courageous and selfless, balancing independence and wisdom.", traits: { independence: 0.4, wisdom: 0.3, skills: 0.2, empathy: 0.1, creativity: 0.0 } },
  { name: "Rebel", desc: "Independent and unconventional, emphasizing independence.", traits: { independence: 0.5, creativity: 0.3, wisdom: 0.1, skills: 0.1, empathy: 0.0 } },
  { name: "Jester", desc: "Playful and witty, thriving on creativity.", traits: { creativity: 0.5, empathy: 0.2, independence: 0.2, wisdom: 0.1, skills: 0.0 } },
  { name: "Caregiver", desc: "Nurturing and supportive, rooted in empathy and independence.", traits: { empathy: 0.4, independence: 0.3, skills: 0.2, wisdom: 0.1, creativity: 0.0 } }
];

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(16);
  console.log("Setup complete"); // Debug log
}

function draw() {
  if (state === 'landing') {
    drawLandingPage();
  } else if (state === 'quiz') {
    drawQuestion();
  } else if (state === 'progress') {
    drawProgress();
  } else if (state === 'results') {
    drawResults();
  }
}

function drawLandingPage() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(135, 206, 235), color(255, 182, 193), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  fill(255);
  textSize(28);
  textStyle(BOLD);
  text("Discover Your Male Archetype", width / 2, 40);
  textSize(16);
  textStyle(NORMAL);
  text("Explore 12 universal patterns of masculinity", width / 2, 70);
  
  let y = 100;
  textSize(14);
  for (let archetype of archetypes) {
    fill(50);
    text(`${archetype.name}: ${archetype.desc}`, width / 2, y);
    y += 20;
  }
  
  fill(255, 165, 0);
  rect(250, 340, 100, 40, 10);
  fill(255);
  textSize(18);
  text("Start Quiz", 300, 360);
}

function drawQuestion() {
  background(173, 216, 230);
  
  let q = randomizedQuestions[currentQuestion];
  fill(50);
  textSize(20);
  text(q.text, width / 2, 40);
  
  textSize(14);
  fill(100);
  text(`Question ${currentQuestion + 1} of 10`, width / 2, 70);
  
  for (let i = 0; i < q.options.length; i++) {
    let y = 100 + i * 60;
    fill(answers[currentQuestion] === i ? [255, 215, 0] : [255, 245, 238]); // Highlight selected option
    rect(150, y - 20, 300, 40, 5);
    fill(50);
    textSize(16);
    text(q.options[i].text, width / 2, y);
  }
  
  // Navigation buttons
  if (currentQuestion > 0) {
    fill(100, 149, 237);
    rect(50, 340, 80, 40, 10);
    fill(255);
    textSize(16);
    text("Previous", 90, 360);
  }
  
  fill(255, 165, 0);
  rect(470, 340, 80, 40, 10);
  fill(255);
  textSize(16);
  text(currentQuestion === 9 ? "Finish" : "Next", 510, 360);
}

function drawProgress() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(144, 238, 144), color(255, 215, 0), inter);
    stroke(c);
    line(0, i, width, i);
  }
  
  fill(255);
  textSize(24);
  text("Calculating Your Archetype...", width / 2, 150);
  
  let barWidth = map(progress, 0, 100, 0, 400);
  fill(50, 205, 50);
  rect(100, 200, barWidth, 20, 10);
  fill(255);
  textSize(16);
  text(`${floor(progress)}%`, width / 2, 210);
  
  progress += 2;
  if (progress >= 100) {
    state = 'results';
    progress = 0;
  }
}

function drawResults() {
  background(221, 160, 221);
  
  let results = calculateArchetypePercentages();
  let topArchetype = results[0];
  
  fill(255);
  textSize(36);
  textStyle(BOLD);
  text(`You are a ${topArchetype.name}!`, width / 2, 100);
  textSize(18);
  textStyle(NORMAL);
  text(`${topArchetype.percentage}% match`, width / 2, 140);
  
  textSize(12);
  let y = 180;
  for (let i = 1; i < results.length; i++) {
    fill(100);
    text(`${results[i].name}: ${results[i].percentage}%`, width / 2, y);
    y += 20;
  }
  
  fill(255, 69, 0);
  rect(250, 340, 100, 40, 10);
  fill(255);
  textSize(18);
  text("Share on FB", 300, 360);
}

function mousePressed() {
  console.log(`Mouse pressed at (${mouseX}, ${mouseY}), state: ${state}`); // Debug log
  if (state === 'landing') {
    if (mouseX > 250 && mouseX < 350 && mouseY > 340 && mouseY < 380) {
      state = 'quiz';
      randomizedQuestions = shuffleArray([...questions]).slice(0, 10);
      currentQuestion = 0;
      scores = { empathy: 0, skills: 0, independence: 0, wisdom: 0, creativity: 0 };
      answers = Array(10).fill(-1); // Initialize answers array with -1 (unanswered)
      console.log("Quiz started, questions randomized:", randomizedQuestions);
    }
  } else if (state === 'quiz') {
    let q = randomizedQuestions[currentQuestion];
    
    // Check for option selection
    for (let i = 0; i < q.options.length; i++) {
      let y = 100 + i * 60;
      if (mouseX > 150 && mouseX < 450 && mouseY > y - 20 && mouseY < y + 20) {
        answers[currentQuestion] = i; // Store selected option
        updateScores(); // Recalculate scores
        console.log(`Answer selected for Q${currentQuestion + 1}: ${q.options[i].text}`);
      }
    }
    
    // Previous button
    if (currentQuestion > 0 && mouseX > 50 && mouseX < 130 && mouseY > 340 && mouseY < 380) {
      currentQuestion--;
      console.log(`Moved to previous question: ${currentQuestion + 1}`);
    }
    
    // Next/Finish button
    if (mouseX > 470 && mouseX < 550 && mouseY > 340 && mouseY < 380) {
      if (currentQuestion < 9) {
        currentQuestion++;
        console.log(`Moved to next question: ${currentQuestion + 1}`);
      } else if (answers.every(a => a !== -1)) { // All questions answered
        state = 'progress';
        console.log("All questions answered, moving to progress");
      } else {
        console.log("Cannot finish: some questions unanswered", answers);
      }
    }
  } else if (state === 'results') {
    if (mouseX > 250 && mouseX < 350 && mouseY > 340 && mouseY < 380) {
      shareOnFacebook();
    }
  }
}

function updateScores() {
  scores = { empathy: 0, skills: 0, independence: 0, wisdom: 0, creativity: 0 }; // Reset scores
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== -1) { // If question is answered
      let q = randomizedQuestions[i];
      let traits = q.options[answers[i]].traits;
      for (let trait in traits) {
        scores[trait] += traits[trait];
      }
    }
  }
  console.log("Updated scores:", scores); // Debug log
}

function calculateArchetypePercentages() {
  let totalScore = scores.empathy + scores.skills + scores.independence + scores.wisdom + scores.creativity;
  if (totalScore === 0) totalScore = 1;
  
  let normalized = {
    empathy: scores.empathy / totalScore,
    skills: scores.skills / totalScore,
    independence: scores.independence / totalScore,
    wisdom: scores.wisdom / totalScore,
    creativity: scores.creativity / totalScore
  };
  
  let results = archetypes.map(archetype => {
    let similarity = 0;
    for (let trait in archetype.traits) {
      similarity += Math.abs(archetype.traits[trait] - normalized[trait]);
    }
    let percentage = (1 - similarity / 2) * 100;
    return { name: archetype.name, percentage: Math.max(0, percentage.toFixed(1)) };
  });
  
  console.log("Calculated archetypes:", results); // Debug log
  return results.sort((a, b) => b.percentage - a.percentage);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function shareOnFacebook() {
  let results = calculateArchetypePercentages();
  let topArchetype = results[0].name;
  let shareText = `I discovered I'm a ${topArchetype} in the Archetype Quiz! Find out your archetype here:`;
  let quizUrl = `https://archtype-grok.vercel.app/?archetype=${encodeURIComponent(topArchetype)}`;
  let facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(quizUrl)}&quote=${encodeURIComponent(shareText)}`;
  
  window.open(facebookUrl, '_blank');
  console.log("Sharing to Facebook:", facebookUrl);
}
