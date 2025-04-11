export default function handler(req, res) {
  const { archetype } = req.query;

  // Default values if no archetype is provided
  const title = archetype ? `I’m a ${archetype}! Discover Your Archetype` : "Discover Your Male Archetype";
  const description = archetype
    ? `I got ${archetype} in the Male Archetype Quiz! Take the quiz to find out which archetype you are.`
    : "Take this quiz to explore 12 universal patterns of masculinity and find out which archetype you embody!";

  // Map archetype to image URL (optional)
  const archetypeImageMap = {
    "King": "https://archtype-grok.vercel.app/king.png",
    "Father": "https://archtype-grok.vercel.app/father.png",
    "Warrior": "https://archtype-grok.vercel.app/warrior.png",
    "Magician": "https://archtype-grok.vercel.app/magician.png",
    "Lover": "https://archtype-grok.vercel.app/lover.png",
    "Sage": "https://archtype-grok.vercel.app/sage.png",
    "Explorer": "https://archtype-grok.vercel.app/explorer.png",
    "Creator": "https://archtype-grok.vercel.app/creator.png",
    "Hero": "https://archtype-grok.vercel.app/hero.png",
    "Rebel": "https://archtype-grok.vercel.app/rebel.png",
    "Jester": "https://archtype-grok.vercel.app/jester.png",
    "Caregiver": "https://archtype-grok.vercel.app/caregiver.png"
  };

  const imageUrl = archetypeImageMap[archetype] || "https://archtype-grok.vercel.app/web-preview.png";
  const shareUrl = archetype ? `https://archtype-grok.vercel.app/?archetype=${encodeURIComponent(archetype)}` : "https://archtype-grok.vercel.app/";

  // Return HTML with the correct OG tags (no redirect)
  res.setHeader("Content-Type", "text/html");
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>

      <!-- Open Graph Metadata -->
      <meta property="og:title" content="${title}">
      <meta property="og:description" content="${description}">
      <meta property="og:image" content="${imageUrl}">
      <meta property="og:url" content="${shareUrl}">
      <meta property="og:type" content="website">
    </head>
    <body>
      <h1>${title}</h1>
      <p>${description}</p>
      <p><a href="${shareUrl}">Take the quiz to discover your archetype!</a></p>
    </body>
    </html>
  `);
}
