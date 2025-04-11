console.log("sketch.js loaded");

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
let lastClickTime = 0; // Debounce variable
const CLICK_DEBOUNCE = 300; // Increased to 300ms for stricter debounce
let questions = []; // Will be loaded from questions.json

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

// Load the questions from questions.json before setup()
function preload() {
  console.log("Preloading questions.json");
  questions = loadJSON("questions.json", () => {
    console.log("questions.json loaded successfully", questions);
  }, (error) => {
    console.error("Failed to load questions.json", error);
  });
}

function setup() {
  createCanvas(600, 400);
  textAlign(CENTER, CENTER);
  textSize(16);
  console.log("Setup complete");
}

function draw() {
  // Add a loading screen until questions are loaded
  if (!questions || questions.length === 0) {
    background(220);
    fill(0);
    text("Loading questions...", width / 2, height / 2);
    return;
  }

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
    // Determine the color based on whether the option is selected
    let fillColor = answers[currentQuestion] === i ? [255, 215, 0] : [255, 245, 238];
    fill(fillColor[0], fillColor[1], fillColor[2]); // Set the fill color
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
  let currentTime = millis();
  if (currentTime - lastClickTime < CLICK_DEBOUNCE) {
    console.log("Click debounced");
    return; // Debounce clicks
  }
  lastClickTime = currentTime;
  
  console.log(`Mouse pressed at (${mouseX}, ${mouseY}), state: ${state}, currentQuestion: ${currentQuestion}`);

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
    
    // Handle option selection
    let optionSelected = false;
    for (let i = 0; i < q.options.length; i++) {
      let y = 100 + i * 60;
      if (mouseX > 150 && mouseX < 450 && mouseY > y - 20 && mouseY < y + 20) {
        answers[currentQuestion] = i; // Store selected option
        updateScores(); // Recalculate scores
        console.log(`Answer selected for Q${currentQuestion + 1}: ${q.options[i].text}`);
        optionSelected = true;
        break; // Exit loop after selecting an option
      }
    }
    
    // Handle navigation only if no option was selected in this click
    if (!optionSelected) {
      // Previous button
      if (currentQuestion > 0 && mouseX > 50 && mouseX < 130 && mouseY > 340 && mouseY < 380) {
        currentQuestion--;
        console.log(`Moved to previous question: ${currentQuestion + 1}`);
      }
      // Next/Finish button
      else if (mouseX > 470 && mouseX < 550 && mouseY > 340 && mouseY < 380) {
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
  console.log("Updated scores:", scores);
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
  
  console.log("Calculated archetypes:", results);
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
