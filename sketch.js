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
const CLICK_DEBOUNCE = 300; // Debounce for touch/click events
let questions = []; // Will be loaded from questions.json
let questionsLoaded = false; // Flag to track if questions are loaded
let archetypeResults = null; // Store the calculated archetype results

// Responsive variables
let canvasWidth, canvasHeight;
let fontSizeLarge, fontSizeMedium, fontSizeSmall;
let buttonWidth, buttonHeight, buttonSpacing;

// Track button press and hover for visual feedback
let buttonPressed = { start: false, prev: false, next: false, fb: false, twitter: false };
let buttonHovered = { start: false, prev: false, next: false, fb: false, twitter: false };

// Define archetypes
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

// Fallback questions in case questions.json fails to load
const fallbackQuestions = [
  {
    text: "How do you approach challenges?",
    options: [
      { text: "With careful planning", traits: { wisdom: 0.3, skills: 0.2 } },
      { text: "With bold action", traits: { independence: 0.3, creativity: 0.2 } },
      { text: "By seeking advice", traits: { empathy: 0.3, wisdom: 0.1 } }
    ]
  },
  {
    text: "What motivates you most?",
    options: [
      { text: "Helping others", traits: { empathy: 0.4, skills: 0.1 } },
      { text: "Achieving goals", traits: { independence: 0.4, wisdom: 0.1 } },
      { text: "Creating something new", traits: { creativity: 0.4, skills: 0.1 } }
    ]
  }
];

// Load the questions from questions.json before setup()
function preload() {
  console.log("Preloading questions.json");
  loadJSON("questions.json", (loadedQuestions) => {
    questions = loadedQuestions;
    console.log("questions.json loaded successfully", questions);
    if (Array.isArray(questions) && questions.length > 0) {
      questionsLoaded = true;
      console.log("questionsLoaded set to true");
    } else {
      console.error("Loaded questions is not a valid array:", questions);
      questionsLoaded = false;
      questions = fallbackQuestions;
      console.log("Using fallback questions:", questions);
    }
  }, (error) => {
    console.error("Failed to load questions.json", error);
    questionsLoaded = false;
    questions = fallbackQuestions;
    console.log("Using fallback questions due to load failure:", questions);
  });
}

function setup() {
  updateCanvasSize();
  let canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('quiz-container');
  textAlign(CENTER, CENTER);
  console.log("Setup complete, canvas created with size:", canvasWidth, "x", canvasHeight);
}

function windowResized() {
  updateCanvasSize();
  resizeCanvas(canvasWidth, canvasHeight);
  console.log("Window resized, new canvas size:", canvasWidth, "x", canvasHeight);
}

function updateCanvasSize() {
  if (windowWidth <= 600) {
    // Mobile
    canvasWidth = windowWidth - 20;
    canvasHeight = windowHeight * 0.85;
    fontSizeLarge = canvasWidth * 0.08; // Increased for better readability
    fontSizeMedium = canvasWidth * 0.05;
    fontSizeSmall = canvasWidth * 0.035;
    buttonWidth = canvasWidth * 0.5; // Wider button for better CTA
    buttonHeight = canvasHeight * 0.1;
    buttonSpacing = canvasWidth * 0.06;
  } else {
    // Desktop
    canvasWidth = 600;
    canvasHeight = 400;
    fontSizeLarge = 36; // Increased for better readability
    fontSizeMedium = 20;
    fontSizeSmall = 14;
    buttonWidth = 200; // Wider button for better CTA
    buttonHeight = 50;
    buttonSpacing = 25;
  }
}

function draw() {
  if (!questionsLoaded && questions.length === 0) {
    drawGradientBackground();
    fill(255);
    textSize(fontSizeMedium);
    text("Loading questions...", width / 2, height / 2);
    console.log("Questions not yet loaded, showing loading screen");
    return;
  }

  // Reset hover states
  buttonHovered.start = false;
  buttonHovered.prev = false;
  buttonHovered.next = false;
  buttonHovered.fb = false;
  buttonHovered.twitter = false;

  // Check for hover states
  if (state === 'landing') {
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = height * 0.75; // Adjusted position
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      buttonHovered.start = true;
    }
  } else if (state === 'quiz') {
    let navButtonY = height * 0.8;
    if (currentQuestion > 0 && mouseX > 30 && mouseX < 30 + buttonWidth && mouseY > navButtonY && mouseY < navButtonY + buttonHeight) {
      buttonHovered.prev = true;
    }
    if (mouseX > width - buttonWidth - 30 && mouseX < width - 30 && mouseY > navButtonY && mouseY < navButtonY + buttonHeight) {
      buttonHovered.next = true;
    }
  } else if (state === 'results') {
    let shareButtonY = height * 0.65;
    if (mouseX > width / 2 - buttonWidth - buttonSpacing / 2 && mouseX < width / 2 - buttonSpacing / 2 && mouseY > shareButtonY && mouseY < shareButtonY + buttonHeight) {
      buttonHovered.fb = true;
    }
    if (mouseX > width / 2 + buttonSpacing / 2 && mouseX < width / 2 + buttonWidth + buttonSpacing / 2 && mouseY > shareButtonY && mouseY < shareButtonY + buttonHeight) {
      buttonHovered.twitter = true;
    }
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

function drawGradientBackground() {
  for (let i = 0; i < height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(110, 72, 170), color(157, 80, 187), inter);
    stroke(c);
    line(0, i, width, i);
  }
}

function drawButton(x, y, w, h, text, c1, c2, isPressed, isHovered) {
  // Adjust colors based on hover and press states
  let startColor = c1;
  let endColor = c2;
  let scaleFactor = 1.0;
  if (isPressed && mouseIsPressed) {
    startColor = color(red(c1) * 0.8, green(c1) * 0.8, blue(c1) * 0.8);
    endColor = color(red(c2) * 0.8, green(c2) * 0.8, blue(c2) * 0.8);
    scaleFactor = 0.95;
  } else if (isHovered) {
    startColor = color(red(c1) * 1.1, green(c1) * 1.1, blue(c1) * 1.1);
    endColor = color(red(c2) * 1.1, green(c2) * 1.1, blue(c2) * 1.1);
    scaleFactor = 1.05;
  }

  // Apply scaling for hover/pressed effect
  push();
  translate(x + w / 2, y + h / 2);
  scale(scaleFactor);
  translate(-(x + w / 2), -(y + h / 2));

  // Add shadow
  drawingContext.shadowBlur = 15;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.5)';

  // Draw gradient
  for (let i = 0; i < h; i++) {
    let inter = map(i, 0, h, 0, 1);
    let c = lerpColor(startColor, endColor, inter);
    stroke(c);
    line(x, y + i, x + w, y + i);
  }

  // Draw border
  noFill();
  stroke(255, 255, 255, 200);
  strokeWeight(2);
  rect(x, y, w, h, 15);

  // Reset stroke and shadow
  noStroke();
  drawingContext.shadowBlur = 0;

  // Draw text
  fill(255);
  textSize(fontSizeMedium * 1.2); // Increased text size for better readability
  textStyle(BOLD);
  text(text, x + w / 2, y + h / 2);

  pop();
}

function drawLandingPage() {
  drawGradientBackground();

  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

  // Title
  fill(255, 245, 255);
  textSize(fontSizeLarge);
  textStyle(BOLD);
  text("Discover Your Male Archetype", width / 2, height * 0.2);

  // Gradient underline for title
  for (let i = 0; i < 5; i++) {
    let inter = map(i, 0, 5, 0, 1);
    let c = lerpColor(color(255, 105, 180), color(255, 150, 200), inter);
    stroke(c);
    strokeWeight(2);
    line(width * 0.3, height * 0.25 + i, width * 0.7, height * 0.25 + i);
  }
  noStroke();

  // Subtitle
  fill(220, 200, 255);
  textSize(fontSizeMedium);
  textStyle(NORMAL);
  text("Explore 12 universal patterns of masculinity", width / 2, height * 0.32);

  // Show only a few archetypes as a teaser
  textSize(fontSizeSmall);
  let y = height * 0.4;
  const teaserArchetypes = archetypes.slice(0, 3); // Show only first 3
  for (let archetype of teaserArchetypes) {
    fill(200, 180, 255);
    text(`${archetype.name}: ${archetype.desc}`, width / 2, y);
    y += fontSizeSmall * 2.5; // Increased spacing
  }

  // Add a "See all archetypes" hint
  fill(180, 160, 240);
  textSize(fontSizeSmall * 0.9);
  text("...and 9 more archetypes to discover!", width / 2, y);

  // Start Quiz button
  let buttonX = width / 2 - buttonWidth / 2;
  let buttonY = height * 0.75;
  let c1 = color(255, 105, 180); // Hot pink
  let c2 = color(255, 150, 200); // Lighter pink
  drawButton(buttonX, buttonY, buttonWidth, buttonHeight, "Start Quiz", c1, c2, buttonPressed.start, buttonHovered.start);

  drawingContext.shadowBlur = 0;
}

function drawQuestion() {
  drawGradientBackground();

  let q = randomizedQuestions[currentQuestion];
  if (!q) {
    console.error("Question is undefined at index", currentQuestion, "randomizedQuestions:", randomizedQuestions);
    state = 'landing';
    return;
  }

  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

  fill(255, 245, 255);
  textSize(fontSizeLarge);
  text(q.text, width / 2, height * 0.12);

  textSize(fontSizeSmall);
  fill(200, 180, 255);
  text(`Question ${currentQuestion + 1} of 10`, width / 2, height * 0.20);

  let optionYStart = height * 0.28;
  for (let i = 0; i < q.options.length; i++) {
    let y = optionYStart + i * (buttonHeight + buttonSpacing * 1.5);
    let optionWidth = width * 0.8;
    let optionX = (width - optionWidth) / 2;

    let fillColor = answers[currentQuestion] === i ? [220, 190, 255] : [255, 255, 255, 200];
    fill(fillColor);
    noStroke();
    rect(optionX, y - buttonHeight / 2, optionWidth, buttonHeight, 10);

    fill(60, 40, 80);
    textSize(fontSizeMedium);
    text(q.options[i].text, width / 2, y);
  }

  let navButtonY = height * 0.80;

  if (currentQuestion > 0) {
    let c1 = color(130, 90, 190);
    let c2 = color(170, 130, 230);
    drawButton(30, navButtonY, buttonWidth, buttonHeight, "Previous", c1, c2, buttonPressed.prev, buttonHovered.prev);
  }

  let c1 = color(190, 120, 220);
  let c2 = color(230, 160, 255);
  drawButton(width - buttonWidth - 30, navButtonY, buttonWidth, buttonHeight, currentQuestion === 9 ? "Finish" : "Next", c1, c2, buttonPressed.next, buttonHovered.next);

  drawingContext.shadowBlur = 0;
}

function drawProgress() {
  drawGradientBackground();

  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

  fill(255, 245, 255);
  textSize(fontSizeLarge);
  text("Calculating Your Archetype...", width / 2, height * 0.35);

  let barWidth = map(progress, 0, 100, 0, width * 0.8);
  let barX = (width - barWidth) / 2;
  fill(170, 130, 230);
  noStroke();
  rect(barX, height * 0.45, barWidth, 20, 10);

  fill(255, 245, 255);
  textSize(fontSizeMedium);
  text(`${floor(progress)}%`, width / 2, height * 0.45 + 10);

  progress += 2;
  if (progress >= 100) {
    archetypeResults = calculateArchetypePercentages();
    state = 'results';
    progress = 0;
  }

  drawingContext.shadowBlur = 0;
}

function drawResults() {
  drawGradientBackground();

  if (!archetypeResults) {
    console.error("Archetype results not calculated yet");
    return;
  }

  drawingContext.shadowBlur = 5;
  drawingContext.shadowColor = 'rgba(0, 0, 0, 0.3)';

  let topArchetype = archetypeResults[0];

  fill(255, 245, 255);
  textSize(fontSizeLarge);
  textStyle(BOLD);
  text(`You are a ${topArchetype.name}!`, width / 2, height * 0.15);

  textSize(fontSizeMedium);
  textStyle(NORMAL);
  text(`${topArchetype.percentage}% match`, width / 2, height * 0.25);

  textSize(fontSizeSmall);
  let y = height * 0.32;
  for (let i = 1; i < archetypeResults.length; i++) {
    fill(200, 180, 255);
    text(`${archetypeResults[i].name}: ${archetypeResults[i].percentage}%`, width / 2, y);
    y += fontSizeSmall * 1.8;
  }

  let shareButtonY = height * 0.65;
  let c1 = color(130, 90, 190);
  let c2 = color(170, 130, 230);
  drawButton(width / 2 - buttonWidth - buttonSpacing / 2, shareButtonY, buttonWidth, buttonHeight, "Share on FB", c1, c2, buttonPressed.fb, buttonHovered.fb);

  c1 = color(190, 120, 220);
  c2 = color(230, 160, 255);
  drawButton(width / 2 + buttonSpacing / 2, shareButtonY, buttonWidth, buttonHeight, "Share on X", c1, c2, buttonPressed.twitter, buttonHovered.twitter);

  drawingContext.shadowBlur = 0;
}

function mousePressed() {
  let currentTime = millis();
  if (currentTime - lastClickTime < CLICK_DEBOUNCE) {
    console.log("Click debounced");
    return;
  }
  lastClickTime = currentTime;

  console.log(`Mouse pressed at (${mouseX}, ${mouseY}), state: ${state}, currentQuestion: ${currentQuestion}`);

  if (state === 'landing') {
    let buttonX = width / 2 - buttonWidth / 2;
    let buttonY = height * 0.75;
    if (mouseX > buttonX && mouseX < buttonX + buttonWidth && mouseY > buttonY && mouseY < buttonY + buttonHeight) {
      buttonPressed.start = true;
      if (questions.length > 0) {
        state = 'quiz';
        randomizedQuestions = shuffleArray([...questions]).slice(0, 10);
        currentQuestion = 0;
        scores = { empathy: 0, skills: 0, independence: 0, wisdom: 0, creativity: 0 };
        answers = Array(10).fill(-1);
        console.log("Quiz started, questions randomized:", randomizedQuestions);
      } else {
        console.log("Cannot start quiz: no questions available", questions);
      }
    }
  } else if (state === 'quiz') {
    let q = randomizedQuestions[currentQuestion];

    let optionSelected = false;
    let optionYStart = height * 0.28;
    for (let i = 0; i < q.options.length; i++) {
      let y = optionYStart + i * (buttonHeight + buttonSpacing * 1.5);
      let optionWidth = width * 0.8;
      let optionX = (width - optionWidth) / 2;
      if (mouseX > optionX && mouseX < optionX + optionWidth && mouseY > y - buttonHeight / 2 && mouseY < y + buttonHeight / 2) {
        answers[currentQuestion] = i;
        updateScores();
        console.log(`Answer selected for Q${currentQuestion + 1}: ${q.options[i].text}`);
        optionSelected = true;
        break;
      }
    }

    let navButtonY = height * 0.80;
    if (!optionSelected) {
      if (currentQuestion > 0 && mouseX > 30 && mouseX < 30 + buttonWidth && mouseY > navButtonY && mouseY < navButtonY + buttonHeight) {
        buttonPressed.prev = true;
        currentQuestion--;
        console.log(`Moved to previous question: ${currentQuestion + 1}`);
      } else if (mouseX > width - buttonWidth - 30 && mouseX < width - 30 && mouseY > navButtonY && mouseY < navButtonY + buttonHeight) {
        buttonPressed.next = true;
        if (currentQuestion < 9) {
          currentQuestion++;
          console.log(`Moved to next question: ${currentQuestion + 1}`);
        } else if (answers.every(a => a !== -1)) {
          state = 'progress';
          console.log("All questions answered, moving to progress");
        } else {
          console.log("Cannot finish: some questions unanswered", answers);
        }
      }
    }
  } else if (state === 'results') {
    let shareButtonY = height * 0.65;
    if (mouseX > width / 2 - buttonWidth - buttonSpacing / 2 && mouseX < width / 2 - buttonSpacing / 2 && mouseY > shareButtonY && mouseY < shareButtonY + buttonHeight) {
      buttonPressed.fb = true;
      shareOnFacebook();
    } else if (mouseX > width / 2 + buttonSpacing / 2 && mouseX < width / 2 + buttonWidth + buttonSpacing / 2 && mouseY > shareButtonY && mouseY < shareButtonY + buttonHeight) {
      buttonPressed.twitter = true;
      shareOnTwitter();
    }
  }
}

function mouseReleased() {
  buttonPressed.start = false;
  buttonPressed.prev = false;
  buttonPressed.next = false;
  buttonPressed.fb = false;
  buttonPressed.twitter = false;
}

function updateScores() {
  scores = { empathy: 0, skills: 0, independence: 0, wisdom: 0, creativity: 0 };
  for (let i = 0; i < answers.length; i++) {
    if (answers[i] !== -1) {
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
  if (!archetypeResults) {
    console.error("Archetype results not calculated yet");
    return;
  }

  let topArchetype = archetypeResults[0].name;
  let shareUrl = `https://archtype-grok.vercel.app/api/og?archetype=${encodeURIComponent(topArchetype)}&t=${Date.now()}`;
  let facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;

  try {
    window.open(facebookUrl, '_blank');
    console.log("Sharing to Facebook:", facebookUrl);
  } catch (error) {
    console.error("Failed to open Facebook share dialog:", error);
    alert(`Facebook sharing is currently unavailable. Please copy this URL and share it manually on Facebook:\n\n${shareUrl}`);
  }
}

function shareOnTwitter() {
  if (!archetypeResults) {
    console.error("Archetype results not calculated yet");
    return;
  }

  let topArchetype = archetypeResults[0].name;
  let shareText = `I discovered I'm a ${topArchetype} in the Archetype Quiz! Find out your archetype here: `;
  let shareUrl = `https://archtype-grok.vercel.app/?archetype=${encodeURIComponent(topArchetype)}&t=${Date.now()}`;
  let twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText + shareUrl)}`;

  window.open(twitterUrl, '_blank');
  console.log("Sharing to Twitter:", twitterUrl);
}
