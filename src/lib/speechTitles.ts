export const speechTitles = [
    "How to ____________ in 10 Easy Steps",
    "The Surprising Truth About ____________",
    "Confessions of a Professional ____________",
    "Why ____________ is the Key to Success",
    "Mastering the Art of ____________",
    "The ____________ Revolution: Changing the Game",
    "From Rags to Riches: My Journey as a ____________",
    "Unleash Your Inner _____________: A Guide",
    "The Dos and Don'ts of ____________",
    "Lessons Learned: What ____________ Taught Me",
    "Embracing the Power of ____________",
    "Reinventing Yourself: Becoming a ____________",
    "The Future of _____________: Trends and Predictions",
    "Overcoming the Challenges of ____________",
    "The ____________ Mindset: Achieving Peak Performance",
    "Navigating the World of ____________: Tips and Tricks",
    "The Art of ____________: Secrets from the Pros",
    "Unlocking the Secrets of ____________",
    "Becoming a ____________ Superhero",
    "The ____________ Phenomenon: Hype or Reality?",
    "Mastering the Art of ____________ Negotiation",
    "The ____________ Lifestyle: Finding Balance and Fulfillment",
    "Disrupting the ____________ Industry: Innovative Approaches",
    "The ____________ Transformation: Embracing Change",
    "Unleashing the Power of ____________: A Masterclass",
    "The ____________ Playbook: Strategies for Success",
    "Navigating the Complexities of ____________",
    "The ____________ Revolution: Redefining the Future",
    "Becoming a ____________ Influencer: Building Your Brand",
    "The ____________ Mindset: Unlocking Your Full Potential",
    "Mastering the Art of ____________ Communication",
    "The ____________ Phenomenon: Separating Fact from Fiction",
    "Embracing the Power of ____________: A Holistic Approach",
    "The ____________ Playbook: Strategies for Entrepreneurial Success",
    "Navigating the World of ____________: Insider Secrets Revealed",
    "The ____________ Transformation: Redefining Personal Growth",
    "Unleashing the Power of ____________: A Masterclass for Innovators",
    "The ____________ Revolution: Disrupting the Status Quo",
    "Becoming a ____________ Thought Leader: Strategies for Impact",
    "The ____________ Mindset: Achieving Sustainable Success",
    "Mastering the Art of ____________ Networking",
    "The ____________ Phenomenon: Exploring the Future of Technology",
    "Embracing the Power of ____________: A Holistic Approach to Wellness",
    "The ____________ Playbook: Strategies for Effective Leadership",
    "Navigating the World of ____________: Insider Secrets for Career Advancement",
    "The ____________ Transformation: Redefining the Workplace",
    "Unleashing the Power of ____________: A Masterclass for Creatives",
    "The ____________ Revolution: Reshaping the ____________ Industry",
    "Becoming a ____________ Trailblazer: Strategies for Visionary Thinking",
    "The ____________ Mindset: Achieving Sustainable Impact",
];

export const segues = [
    "Did you know that ____________ is the most interesting fact you'll learn today?",
    "I bet you didn't know that ____________ is a secret passion of mine.",
    "You'll never guess what ____________ has to do with our topic.",
    "The craziest thing about ____________ is that it's actually true.",
    "If you think ____________ is impressive, wait until you hear about this.",
    "You're not going to believe this, but ____________ is the key to understanding it all.",
    "I've been dying to tell someone about ____________, and now's the perfect time.",
    "____________ may seem random, but it's actually the perfect segue.",
    "Hold on to your hats, because ____________ is about to blow your mind.",
    "You're going to want to remember ____________ for later, trust me.",
    "I know it sounds weird, but ____________ is the reason why this all makes sense.",
    "Prepare to be amazed, because ____________ is the most incredible thing you'll hear all day.",
    "I can't believe I haven't mentioned ____________ yet, it's so important to this whole thing.",
    "You're going to want to write this down: ____________ is the key to understanding it all.",
    "I know it's a bit of a stretch, but ____________ is actually the perfect example of what we're talking about.",
    "If you thought ____________ was interesting, just wait until you hear about this.",
    "I know it's a bit of a tangent, but ____________ is actually really relevant to our discussion.",
    "You're not going to believe this, but ____________ is the reason why this all makes sense.",
    "I know it seems random, but ____________ is actually the perfect way to tie this all together.",
    "Hold on to your seats, because ____________ is about to blow your mind.",
    "I know it's a bit of a leap, but ____________ is the perfect way to illustrate this point.",
    "You're going to want to remember ____________, because it's the key to understanding everything.",
    "I can't believe I haven't mentioned ____________ yet, it's so important to this whole thing.",
    "If you thought ____________ was interesting, just wait until you hear about this other thing.",
    "I know it's a bit of a tangent, but ____________ is actually really relevant to our discussion.",
    "You're not going to believe this, but ____________ is the reason why this all makes sense.",
    "I know it seems random, but ____________ is actually the perfect way to tie this all together.",
    "Hold on to your hats, because ____________ is about to blow your mind.",
    "I know it's a bit of a stretch, but ____________ is actually the perfect example of what we're talking about.",
    "You're going to want to write this down: ____________ is the key to understanding it all.",
    "I can't believe I haven't mentioned ____________ yet, it's so important to this whole thing.",
    "If you thought ____________ was interesting, just wait until you hear about this other thing.",
    "I know it's a bit of a tangent, but ____________ is actually really relevant to our discussion.",
    "You're not going to believe this, but ____________ is the reason why this all makes sense.",
    "I know it seems random, but ____________ is actually the perfect way to tie this all together.",
    "Hold on to your seats, because ____________ is about to blow your mind.",
    "I know it's a bit of a leap, but ____________ is the perfect way to illustrate this point.",
    "You're going to want to remember ____________, because it's the key to understanding everything.",
    "I can't believe I haven't mentioned ____________ yet, it's so important to this whole thing.",
    "If you thought ____________ was interesting, just wait until you hear about this other thing.",
    "I know it's a bit of a tangent, but ____________ is actually really relevant to our discussion."
];

export function pickThree() {
    const titles = [];

    for (let i = 0; i < 3; i++) {
        titles.push(speechTitles[Math.floor(Math.random() * speechTitles.length)]);
    }

    return titles;
}

export function twoSegues() {
    const s = [];

    for (let i = 0; i < 2; i++) {
        s.push(segues[Math.floor(Math.random() * segues.length)]);
    }

    return s;
}