/* ============================================================
   Mehamoten (English) - game content (cards, host personas, debrief)
   Data only, no logic. Localized for mixed international groups:
   simple English, no Israeli-only references, no puns, lots of body play.
   Card shape: [title, description, opening hint]
   ============================================================ */
"use strict";

const MM_DATA = {
  /* ---------- Stage (place + characters) ---------- */
  set: [
    ["Hospital waiting room","Two siblings competing for attention","Start arguing about who cares more. No explaining, go straight into it."],
    ["Driving test","A strict examiner and a very nervous driver","Start the engine right away. Let the examiner react to your first mistake."],
    ["Wedding","The wedding planner and a guest who has lost the rings","The ceremony starts in two minutes. Check every pocket."],
    ["Stuck elevator","The CEO and the employee who quit yesterday","Press the button. Nothing happens. Everything falls apart from there."],
    ["Safari","A tour guide and a tourist who thinks he is a magician","Point at a far away 'animal'. The tourist gets very excited."],
    ["Ice cream shop","A customer who can't decide and a worker losing patience","First taste, then doubt. The worker gets more and more impatient."],
    ["Pharaoh's tomb","Two scared treasure hunters","Whispering in the dark. Someone heard a noise."],
    ["Job interview","The interviewer is the candidate's old boss","One handshake, then a shocked look. You know each other."],
    ["Spaceship","Two astronauts. One is out of oxygen","Countdown, then a red warning light."],
    ["Gym","A personal trainer and a client who lies about being fit","Lift an imaginary heavy weight and start lying about the numbers."],
    ["Coffee shop","Two strangers who both want the last free table","Put your coffee down at the same moment. Smile. Nobody moves."],
    ["Desert island","Two survivors with very different survival plans","One builds a hut, the other builds a hotel."],
    ["Pet shop","A seller and a customer who wants to return a duck","Put the duck on the counter: 'I want to return this.'"],
    ["Hotel reception","A clerk and a guest sure they booked a suite","'I have a suite booked.' The clerk finds nothing."],
    ["Fancy restaurant","A waiter and a customer who cannot find their wallet","The meal is over. The hand goes into an empty pocket."],
    ["Classroom","A substitute teacher and a student who runs the class","The substitute walks in. The student is already 'in charge'."],
    ["Museum","Two visitors arguing about a painting that is actually a fire alarm","Stand in front of it. Admire it. Explain what it 'means'."],
    ["Supermarket, closing time","A super calm cashier and a customer in a panic","Start with the beep of the scanner. The line behind you is getting angry."],
    ["Camping trip","A guide counting people and a driver who got lost","Start counting. Someone is missing."],
    ["Hair salon","A confident hairdresser and a client who sees the result","Look in the 'mirror'. Let your face do the talking."],
    ["Empty party hall","A singer and a sound tech. No guests came","Mic check: one, two... and nobody is here."],
    ["Food truck","A happy food truck owner and a health inspector who checks everything","Hand over a free sample. The inspector takes out a notebook."],
    ["Escape room","Two friends stuck. One reads the clues backwards","The timer is ticking. The clue makes no sense."]
  ],

  /* ---------- Constraint: style ---------- */
  style: [
    ["Soap opera","Big drama, long looks, family secrets","Slow everything down. A dramatic look into the distance after every secret."],
    ["Action movie","Cool one-liners in the middle of a disaster","Say one cool line right in the middle of the explosion."],
    ["Nature documentary","One player describes the other like an animal in a nature film","Whisper about your partner like an animal in a nature film."],
    ["Musical","When a feeling comes up, sing it with moves","When you feel something, sing it. Don't say it."],
    ["Horror movie","Scary music with your mouth, bad decisions on purpose","Make a bad decision on purpose, and make scary music with your mouth."],
    ["Old detective film","Slow, gloomy talk. Say your thoughts out loud","Speak slowly. Say what you are thinking out loud."],
    ["TV shopping channel","Crazy excitement about the most normal object","Show that a normal object is the most exciting thing ever."],
    ["Cartoon hero","Shout the names of your 'special moves', huge feelings","Shout the name of every move. Every small feeling is huge."],
    ["Royal palace","Very fancy, very formal, very old fashioned","Be super formal: 'Would Your Highness kindly pass the salt?'"],
    ["Reality show","Turn to the 'camera' to gossip about your partner","Turn to the 'camera' and gossip about your partner."],
    ["Silent movie","No words. Only faces and big moves","No words at all. Everything with faces and big gestures."],
    ["True crime show","A dramatic narrator explains 'what went wrong'","Narrate dramatically: 'And this is exactly where it all went wrong.'"]
  ],

  /* ---------- Constraint: language ---------- */
  lang: [
    ["A to Z","Each sentence starts with the next letter of the alphabet","Just remember the next letter. Don't plan the whole sentence."],
    ["One word","Build sentences together, one word each","One word each. Listen and build together."],
    ["Only questions","No normal sentences allowed","Answer a question with a question. Don't give in."],
    ["Three words","Pick 3 words. Only those are allowed","Use only the same 3 words. Change your voice each time."],
    ["Translator","Player A speaks emotional gibberish, player B translates","Use funny sounds and big emotions. The translator speaks with confidence."],
    ["Sound effects","Add a sound effect to every sentence","Every sentence gets a sound: a door, a bird, a car, anything."],
    ["Super polite","Speak like a very polite butler, no matter what","Even when angry, stay super polite: 'I am terribly sorry, sir.'"],
    ["No yes, no no","You can never say 'yes' or 'no'","Find other ways: 'of course', 'never', 'maybe'."],
    ["Echo","Repeat your last word 3 times, softer each time","Repeat the last word three times, fading away."],
    ["Spokesperson","Never answer directly. Change the subject and say a short slogan","Don't answer. Change the subject and say a short slogan."],
    ["Take it back","Say a sentence, then 'correct' it to the opposite","Say a sentence, then 'No, the opposite!' and flip it."],
    ["Third person","Talk about yourself only in the third person","Use your own name instead of 'I', like a sports commentator."]
  ],

  /* ---------- Constraint: body ---------- */
  body: [
    ["Puppets","The audience calls out moves. You do them and explain why","Do every move the audience calls out, and explain in words why you did it."],
    ["Word helpers","Stuck? Point at someone in the audience and they call out the next word","Stuck? Point at someone in the audience. They give you the next word."],
    ["Secret notes","5 notes from the audience. Use each one as a line","Read each note as a normal line. Don't explain it."],
    ["The book","A random book. On your turn, read a sentence from it","Read a line from the book like it is a natural part of the talk."],
    ["Status switch","One is a king, one is a nobody. Halfway, you switch","Start extreme, king and nobody, then switch suddenly."],
    ["No eye contact","Never look at each other. Stand side by side","Stand side by side and never look at each other."],
    ["Slow motion","Move super slowly, talk at normal speed","Super slow body, normal talking. The contrast is the joke."],
    ["One object","Both of you pretend to hold the same imaginary object. If you let go, the world changes","Hold it together. If one of you lets go, the story changes."],
    ["Mirror","Player B copies every move of player A while they argue","Copy every move exactly, while arguing with words."],
    ["Big and small","One acts very confident, the other very shy. Show it only with your body","One looks confident, the other looks shy. Don't say it."]
  ]
};

/* ---------- Stage packs by industry (team mode) ---------- */
const MM_INDUSTRY = {
  office: { label:"General office", ic:"🏢", cards:[
    ["Meeting room","A manager who keeps talking and someone who must leave","'Just one last point.' A look at the clock."],
    ["Office kitchen","The one who ate the lunch and the one who lost it","The box is empty. You are both at the fridge."],
    ["Office elevator","The CEO and a new employee who doesn't know it's the CEO","Small talk about 'the boss', with the boss."],
    ["Coffee corner","Two coworkers gossiping about the person who just walked in","In the middle of the gossip, he walks in."],
    ["Exit interview","HR and an employee who doesn't care anymore","'Why are you leaving?' And the truth comes out."],
    ["New hire training","A mentor and a new hire who already 'knows everything'","'Let me show you how.' 'Yeah, I know.'"],
    ["Company fun day","The event planner and an employee who didn't want to come","'Isn't this fun?!' 'When do we go home?'"],
    ["Budget meeting","The finance director and a manager who wants more","'We cut 10 percent.' 'Actually I wanted to add.'"]
  ]},
  hitech: { label:"Tech", ic:"💻", cards:[
    ["Morning stand-up","A team lead and a developer who finished nothing","'What did you do yesterday?' The developer starts improvising."],
    ["Client demo","A sales person and a developer. The demo crashes live","Click 'Run'. The screen freezes. Smile at the client."],
    ["Coding interview","An interviewer and a candidate who said he knows everything","'Write me an algorithm.' The candidate squirms."],
    ["Friday deploy","DevOps and a team lead at 5:55 PM","'Just a tiny change.' And the site goes down."],
    ["Retro meeting","A happy scrum master and a grumpy developer","'What went well this sprint?' Long silence."],
    ["Startup kitchen","An excited founder and an employee who just wants coffee","The founder presents a 'new vision' in front of the coffee machine."],
    ["One on one","A manager and an employee who wants a raise but is scared","'How are you feeling?' 'Great...' (he is not)."],
    ["Server room","A technician and a CEO who wants to 'unplug just one cable'","The CEO points at a cable. The technician goes pale."]
  ]},
  health: { label:"Healthcare", ic:"🩺", cards:[
    ["Nurses' station","A senior nurse and a resident on day one","'Where is everything?' The nurse answers with (fake) patience."],
    ["Waiting room","A receptionist and a patient sure he is next","'Number 47.' 'But I was here first!'"],
    ["Doctor's visit","A doctor and a patient who already checked the internet","The patient opens: 'I read online that...'"],
    ["Operating room (pretend)","A surgeon and an assistant who can't find the tool","'Scalpel.' Nothing. 'Scalpel!' Still nothing."],
    ["Shift change","Two nurses. One exhausted, one full of energy","The tired one talks slowly. The other asks ten questions a second."],
    ["Pharmacy","A pharmacist and a customer with unreadable handwriting","The pharmacist turns the paper. Again. And again."],
    ["Ambulance","A paramedic and a new volunteer excited by everything","The siren turns on. The volunteer shouts 'Wow!'"],
    ["Safety committee","The committee head and the person who brought cake","'Item one.' 'Anyone want cake?'"]
  ]},
  education: { label:"Education", ic:"🎒", cards:[
    ["Teachers' room","A senior teacher and a new teacher full of ideas","'I have an idea!' 'Another one?'"],
    ["Parent meeting","A teacher and a parent sure their kid is a genius","'Your child is lovely, but...' 'But what?!'"],
    ["Staff meeting","The principal and a teacher who didn't read the email","'As I said in my email...' A blank face."],
    ["School trip","A teacher and the bus driver. 40 kids in the back","'Is everyone here?' 'Counting now... 39.'"],
    ["Recess duty","Two teachers on duty pretending the chaos is fine","Point at an imaginary ball fight and react."],
    ["Graduation party","The coordinator and a student who wants a 20 minute speech","'You have one minute.' 'So, let's start from first grade...'"],
    ["Library","A quiet librarian and a teacher who talks loudly","'Shhh.' The teacher talks even louder."],
    ["Teacher training","An outside speaker and teachers waiting for lunch","'Who knows this model?' Everyone looks at the clock."]
  ]},
  sales: { label:"Sales & service", ic:"📞", cards:[
    ["Call center","An agent and a customer who waited 40 minutes","'Thank you for waiting.' 'Forty minutes!'"],
    ["Sales meeting","A sales person and a client who only wants a discount","The slides open. 'How much is it?'"],
    ["Trade show booth","A sales rep and a visitor who only came for free stuff","'Can I tell you about our product?' 'Do you have a pen?'"],
    ["Targets meeting","A sales manager and a rep who missed the target by 2%","'Only two percent.' 'Only?'"],
    ["Chat support","A support agent and a customer who TYPES IN CAPS","The customer 'shouts' every line. The agent stays calm."],
    ["Big sale day","A seller and a customer who wants the last item","You both stare at the same empty shelf."],
    ["Contract renewal","An account manager and a client threatening to leave","'We are looking at a competitor.' A frozen smile."],
    ["Sales team party","The star of the month and the newest person on the team","A toast, with a compliment that is really a small insult."]
  ]}
};

const MM_CAT = {
  set:{label:"Stage",ic:"📍",ltr:"S"}, style:{label:"Style",ic:"🎭",ltr:"T"},
  lang:{label:"Words",ic:"💬",ltr:"W"}, body:{label:"Body",ic:"🤸",ltr:"B"},
  guess:{label:"Guess",ic:"🕵️",ltr:"G"}, ear:{label:"Earpiece",ic:"🎧",ltr:"E"}
};

/* ---------- Guess cards: one guesser, everyone else gives hints ---------- */
const MM_GUESS = [
  {t:"Who am I",d:"The guesser does not know their secret identity. Give hints with questions and actions. Never say the name!",k:"The secret identity",
   s:["Superman","Cleopatra","Harry Potter","Albert Einstein","The Little Mermaid","Napoleon","Santa Claus","Sherlock Holmes","Mona Lisa","A pirate captain"]},
  {t:"Party guests",d:"A guest arrives at the guesser's party with a strange habit. Guess the habit from the behavior!",k:"The strange habit",
   s:["Thinks he is a robot","Best friends with a chair","Thinks everyone is his old teacher","Afraid of long words","Sure he is an undercover detective","Must touch the ceiling every minute","Sure the floor is lava","Talks to his shoes"]},
  {t:"Late for work",d:"The guesser is late for work. Hint at the reason by talking and acting, but never say the reason itself!",k:"The reason for being late",
   s:["You were taken by aliens","The dog ate your keys","You got stuck in a hot tub at the mall","You chased an ostrich","You got married by mistake","You fell asleep in the supermarket","You saved a cat from a tree and got stuck","You ran a secret race"]},
  {t:"The hidden object",d:"Play a normal scene around a secret object. You can talk, just never say its name. The guesser must guess the object!",k:"The object",
   s:["Toothbrush","Iron","Glue stick","Broken phone","Inside-out umbrella","TV remote","Kettle","Throw pillow"]},
  {t:"Confession",d:"The guesser did something 'bad'. Hint at what it was, without saying it directly!",k:"The bad thing",
   s:["Ate everyone's food from the fridge","Sold the company car","Swapped the coffee for decaf","Lied about knowing Excel","Stole a plant from the lobby","Said 'sounds good' to the boss without reading the email"]},
  {t:"The perfect crime",d:"The guesser is a detective. Hint at the weapon, the place and the reason, by talking and acting, never directly!",k:"The case file",
   s:["Banana · in the kitchen · jealous of a promotion","Keyboard · in the parking lot · a parking fight","Plant · in a team meeting · boredom","Mop · in the elevator · a $20 debt","Ice bag · in the lobby · a fight over the AC","Toaster · in the meeting room · a joke that went wrong"]}
];

/* ---------- The Earpiece: secret missions for the agent (back to the screen, can't see) ----------
   Shape: [short title, what to do]. No physical contact, fine for teams and kids. */
const MM_EAR = [
  /* a word that keeps coming back */
  ["Dog","Say the word 'dog' as many times as you can"],
  ["Banana","Say 'banana' three times, each time in a different way"],
  ["Really really","Add 'really really' before every description"],
  ["Buddy","End every sentence with the word 'buddy'"],
  ["The fridge","Keep coming back to the fridge, like it is very important to the story"],
  ["My grandma","Say 'My grandmother always says...' again and again"],
  ["Penguin","Find a reason to say 'penguin' three times"],
  ["Exactly!","Say 'Exactly!' after everything your partner says"],
  ["On Tuesday","Mention 'on Tuesday' like something huge happened then"],
  ["Exact numbers","Put an exact number in every sentence: 17 percent, 42 minutes, 3 kilos"],
  ["Other language","Put one word from another language into every sentence"],
  ["Pizza","Bring the talk back to pizza, no matter what the topic is"],
  /* identity and names */
  ["Kevin","Call your partner 'Kevin', like it was always their name"],
  ["Doctor","Call your partner 'Doctor' in every sentence"],
  ["Siblings","Act like you are brother and sister, without saying it"],
  ["We met before","Insist you met once at a wedding, and add details"],
  ["The fan","Act like your partner is a famous person and you are a big fan"],
  ["Other name","Introduce yourself with a different name, and correct people when they get it wrong"],
  ["The boss","Treat your partner like your boss"],
  ["The twin","Hint that you have a twin who sometimes takes your place"],
  ["The school trip","Remind your partner of a funny moment from a school trip"],
  ["Secret agent","Act like a secret agent who thinks your partner is the target"],
  ["What's your name?","Pretend you forgot their name, and guess wrong names"],
  ["Alien","Gently hint that you are not from planet Earth"],
  /* things that don't exist */
  ["Flontration","Use the made-up word 'flontration' like it is a normal word"],
  ["Simon's Rule","Explain a made-up science rule called 'Simon's Rule'"],
  ["A famous study","Say 'a famous university study proves this' about something silly"],
  ["The coconut exercise","Suggest doing 'the coconut exercise' together and explain it with confidence"],
  ["Sock Day","Mention 'Sock Day' like it is tomorrow"],
  ["Cloud manager","Say your job is 'cloud manager' (real clouds, in the sky)"],
  ["By the rules","Mention made-up rules with letters, like 'by rule B.L.T.'"],
  ["The app","Strongly recommend an app that doesn't exist, with a weird name"],
  ["Spaghettoffle","Describe a new food called 'spaghettoffle' like you love it"],
  ["Old saying","Make up a short wise saying and repeat it"],
  ["Mop ball","Talk about a strange sport called 'mop ball', like everyone watches it"],
  ["New word","Invent a new word and use it again and again"],
  /* how you talk */
  ["Only questions","Talk only in questions"],
  ["Agree with everything","Agree with everything your partner says, with too much excitement"],
  ["Whisper","Whisper every time someone's name comes up"],
  ["Argue","Argue about every small detail, very politely"],
  ["Compliments","Compliment your partner on something new every few sentences"],
  ["Song","Sing one line of a song you are making up, in the middle of the talk"],
  ["The secret","Pretend you have a big secret, and don't tell it"],
  ["Sorry","Apologize for things that have nothing to do with you"],
  ["My idea","Say your partner's last idea again, and pretend it was yours"],
  ["So moved","Act like a very small thing makes you cry with emotion"],
  ["The neighbors","Ask your partner about something strange happening in their street"],
  ["Never-ending story","Start a story and never finish it, three times"],
  /* body, no touching */
  ["Stretch","Stretch every time your partner asks a question"],
  ["The clock","Check the time again and again, like you are in a hurry"],
  ["Invisible chair","Sit on an invisible chair in the middle of the talk"],
  ["Pointing","Point at something far away every time you lie"],
  ["Phone call","Answer an imaginary phone call, then come back like nothing happened"],
  ["Dance step","Do a small dance step after every good line of yours"],
  ["The glasses","Act like you lost your glasses and can't see well"],
  ["Sneeze","Sneeze dramatically at least twice"],
  ["One clap","Clap once every time you agree"],
  ["One leg","Stand on one leg (or pretend to) as long as you can, without explaining"],
  ["Fly","Wave away an imaginary fly that only bothers you"],
  ["Hands on hips","Keep your hands on your hips, like a site manager"],
  /* plot and surprises */
  ["Lottery","Hint that you won the lottery, without saying it"],
  ["Iceland","Try to convince your partner to move to Iceland with you"],
  ["The sale","Try to sell your partner something from your pocket"],
  ["All your fault","Pretend your partner caused a funny problem yesterday"],
  ["NASA","Say you got a message from NASA this morning"],
  ["The recipe","Try to get a secret recipe out of your partner"],
  ["Surprise party","Hint that a surprise party is being planned for your partner"],
  ["Time traveler","Act like you just arrived from the past"],
  ["The dog that is a fish","Talk about your dog, who is actually a fish"],
  ["TV show","Act like you are on a TV show right now"],
  ["Have to go","Say you really have to go, and don't go"]
];

/* ============================================================
   Screen mini games: emotions, line from the screen, three heads, dubbing, expert
   ============================================================ */
/* Remote control emotions: a separate emotion per player */
const MM_EMO = ["Too much excitement","Suspicion","Total boredom","Panic you try to hide","Huge pride","Jealousy","Deeply offended","Extremely tired","Curious like a kid","Guilty","Way too confident","Calm like a lake","Deadline stress","Missing the old days","Huge relief","Totally confused","Impatient","Very grateful","Embarrassed","Proud of a tiny win","Bored","Super optimistic","Super pessimistic","Stage fright","Angry but holding it in"];
/* a shared moment for both */
const MM_EMO_BOTH = ["Both of you: trying to hide panic","Both of you: sure you are right","Both of you: like you just solved a huge problem","Both of you: trying not to laugh","Both of you: suspicious of each other","Both of you: moved to tears","Both of you: whispering, someone is asleep","Both of you: in total shock"];

/* Line from the screen: a line you must use in the scene now */
const MM_LINES = ["I actually thought this was your idea.","Wait, nobody checked this?","There is a very good reason I didn't tell you before.","I think we are talking about two different things.","OK, that changes everything.","Can we go back to the beginning for a second?","For me, this actually solved the problem.","I'm starting to see where we went wrong.","This is exactly what my mom warned me about.","Tell me, is that your dog?","I'm not answering that without a lawyer.","So that's why the ducks ran away.","The last time I did this, I woke up on a boat.","Don't look now, but someone is following us.","This is not the first time I've met a king.","I have to tell you something about my uncle.","I told you it won't work without glue.","Let's vote.","I'm ready to quit over this.","Who ordered pizza?","That explains the smell.","I'll just say it: I miss the nineties.","I have a plan, but it's illegal in Switzerland.","From now on, I choose to be positive.","You sound exactly like my last manager.","And then I realized I was on the wrong floor.","Quiet! I hear something.","I think it's time for lunch.","That's the nicest thing anyone said to me this week.","I'll get back to you on that after the holidays."];

/* Three heads: a question for the expert + rules that come in mid-answer */
const MM_HEADS_Q = ["How do you make every meeting end on time?","What is the scientific way to survive Monday morning?","How do you know which email you really must answer?","How do you build the perfect team?","What do you do when you have more tasks than time?","How do you convince a team that a weird idea is great?","What will the office look like in 2040?","How do you decide when nobody agrees?","How do you teach a cat to use a computer?","What is the secret to the perfect vacation?","How do you get out of a traffic jam without leaving the car?","How do you make the best coffee in the world?","Why do socks always disappear in the wash?","How do you ask for a raise?","How do you organize the office fridge?","What do you do when the elevator gets stuck with the CEO?"];
const MM_HEADS_RULES = ["From now on: the answer ends in 12 words","Use the word 'watermelon' in your answer","End with a sentence that sounds totally professional","From now on: whisper","From now on: like a news reporter","The expert suddenly gives a different answer","Give an example from the expert's personal life","The expert shows a very strong emotion","Add a serious warning","Sum up in three numbered steps","The expert suddenly remembers they are on vacation","Answer one question from the audience"];

/* Dubbing: facts the translator must make happen */
const MM_DUB_FACTS = ["Both of them think they are the new manager","One of them hasn't realized the meeting was cancelled","The budget they are talking about is really 50 dollars","One of them thinks today is Friday","They are talking about two different projects without noticing","Both are trying not to be the first to say 'no'","One of them came to the wrong meeting","The decision they are arguing about was already made yesterday","One of them is a famous singer on vacation","Tomorrow they open a restaurant together","One of them is allergic to everything the other says","They are planning a surprise party for the manager","They just found out they are related","One of them is trying to sell the other a fridge","The office is moving to the moon next week","They have been waiting three hours for the elevator"];

/* An expert who doesn't exist: identity + two hints the interviewers read */
const MM_EXPERT = [
  {t:"Expert in making meetings shorter with food",h:["It's about meetings","There is food involved"]},
  {t:"Consultant for the perfect excuse for being late",h:["It's about time","Something you tell the boss"]},
  {t:"Researcher of 'just a quick reminder' messages",h:["It's about messages","It's a bit annoying"]},
  {t:"Coach for managers who decide by flipping a coin",h:["It's about decisions","Luck is involved"]},
  {t:"Expert in spotting who didn't read the email",h:["It's about emails","Someone is lying"]},
  {t:"Consultant for companies that want to cancel Mondays",h:["It's about days of the week","Something everyone hates"]},
  {t:"Scientist of coffee breaks",h:["It's about breaks","There is a hot drink"]},
  {t:"Trainer of cats for office jobs",h:["There is an animal","It's about the office"]},
  {t:"Letter designer for 'No Parking' signs",h:["It's about parking","It's about writing"]},
  {t:"Chef for meals eaten on video calls",h:["It's about food","There is a camera"]},
  {t:"Wedding planner for robots",h:["It's about an event","There are machines"]},
  {t:"Tour guide inside a fridge",h:["It's about a tour","A cold place"]},
  {t:"Fitness coach for typing fingers",h:["It's about sport","Hands and a keyboard"]},
  {t:"Translator from baby language",h:["It's about language","Someone very small"]},
  {t:"Couples therapist for house plants",h:["It's about relationships","There are plants"]},
  {t:"Private detective for lost socks",h:["It's about an investigation","Something that disappears in the wash"]}
];

/* Kids version: items from the new games that are not shown to kids (by title or text) */
const MM_KIDS_SKIP_NEW = new Set(["Lottery","The neighbors","I'm not answering that without a lawyer.","I'm ready to quit over this.","I have a plan, but it's illegal in Switzerland.","How do you ask for a raise?"]);

/* ---------- Kids version: what is filtered ---------- */
const MM_KIDS_BLOCK = new Set(["Coffee shop","Museum","Desert island","Super polite","Exit interview"]);
const MM_KIDS_TOPIC_BLOCK = ["in love","lies","lying"];

const MM_TIPS = [
  "Yes, and... Accept every offer from your partner and build on it. Never block.",
  "Specific always wins: 'a nervous 11 year old poodle' is better than 'a dog'.",
  "Found something funny? Make it bigger, step by step, again and again.",
  "React clearly to what your partner says. You don't need big ideas.",
  "Make a clear choice and show it with confidence.",
  "Remember something from the start, and bring it back near the end."
];

const MM_TOPICS = [
  "Suddenly a delivery person walks in and asks what is going on","Now the scene becomes a musical","A sudden heavy rain starts",
  "One of you reveals a big secret, right now","The phone rings. Who is it?!","Suddenly you are late for something urgent",
  "A surprising third character walks in. Imagine them","Something falls with a huge crash!","It turns out you are long-lost cousins",
  "Suddenly you are in space","Your pet is missing","Someone says the truth they were not supposed to say",
  "An uninvited guest arrives","You find out you are stuck together","Time is running out. Decide now!",
  "Suddenly everyone whispers","One of you has been lying the whole time","This moment... was all a dream",
  "Suddenly one of you can only talk in a robot voice","You are on the news. Report live","One of you is a secret agent",
  "The power goes out. Keep going in the dark","You won a million dollars, and now you fight over it","Suddenly you are inside a TV ad"
];

const MM_OPENERS = [
  "I can't believe this is happening right now.","OK, I have to tell you something.","I've waited for this moment all day.",
  "You won't believe what happened to me this morning.","We can't stay here.","Listen, we don't have much time.",
  "I knew I'd find you here.","Wait, did you hear that too?"
];

/* ---------- Host personas ---------- */
const MM_PERSONA = {
  compere:{ name:"The Host",
    intro:n=>`Everyone, welcome! ${n}, come up to the stage!`,
    frame:(p,r,s)=>`You are ${r}. The place: ${p}. ${s}, you start!`,
    draw:(s,c)=>`The stage: ${s}. The twist: ${c}. Go!`,
    swap:["Swap!","Swap! Surprise me!","Swap, now!","Again! Swap!"],
    topic:t=>`New twist! ${t}`,
    timeup:["Time's up! Big applause!","And that's it! Beautiful!","Done! Well played!"],
    test:"Hello! I'm your host tonight. Ready to improvise?"},
  cynic:{ name:"The Cynic",
    intro:n=>`OK. ${n}, let's get this over with.`,
    frame:(p,r,s)=>`You are ${r}, at ${p}. ${s} starts. Good luck with that.`,
    draw:(s,c)=>`${s}. Twist: ${c}. You'll need it.`,
    swap:["Swap. Oh, come on.","Swap. Try again.","Swap. Saw that coming.","Swap. Try harder this time."],
    topic:t=>`Well then, ${t}. Enjoy.`,
    timeup:["Over. Finally.","That's it. I've seen enough.","Time's up. Lucky you."],
    test:"Yes, yes. I'm the host. Let's see what you've got."},
  manic:{ name:"The Hype Machine",
    intro:n=>`Wow wow wow! ${n}! Go go go!`,
    frame:(p,r,s)=>`${p}!! You are ${r}!! ${s}, start NOW!!`,
    draw:(s,c)=>`${s}!! And the twist: ${c}!! BOOM!`,
    swap:["Swap swap swap!","Swap! Let's go!","Boom! Swap!","Swap!! More!!"],
    topic:t=>`Twist!! ${t}!!`,
    timeup:["Boom! Done!","Ta-daaa! That's it!","Wow! Time's up!"],
    test:"Heyyy! I'm the craziest host there is! Let's goooo!"}
};

/* ---------- Team debrief (HR mode) ---------- */
const MM_DEBRIEF = [
  {theme:"Listening and 'Yes, and...'", qs:["When did you feel you really listened to your partner and built on their idea?","Where at work do we block ideas instead of saying 'Yes, and...'?"]},
  {theme:"Flexibility with the unknown", qs:["How did it feel when 'Swap!' suddenly changed your direction?","What does it teach us about how we react to surprises at work?"]},
  {theme:"Safe to make mistakes", qs:["How did it feel to make a mistake in front of everyone, and laugh about it together?","What would change if we felt this safe in team meetings too?"]},
  {theme:"Teamwork and backup", qs:["Who 'saved' you on stage, and how?","Where in daily work can we back each other up more?"]},
  {theme:"Being present and connected", qs:["What did you learn about a teammate that you didn't know before?","How do we keep this energy and openness after today?"]},
  {theme:"Roles and leadership", qs:["Who took the lead when the scene got stuck, and what can we learn from it?","When is it right to lead, and when is it right to let someone else lead?"]}
];

/* ---------- Constraint explanations: what it means + example (shown on the card screen) ---------- */
const MM_CON_EXPLAIN = {
  "Soap opera": ["Play it like a TV soap opera: every small thing is a huge drama, with long looks and family secrets.", "\"You... you are not really my brother. You are my TWIN brother!\""],
  "Action movie": ["Play it like an action movie: everything explodes, and you stay cool and say tough lines.", "\"The building is falling? Then we take the stairs.\""],
  "Nature documentary": ["One of you is the narrator of a nature film. Whisper about the other one like a rare animal.", "\"And here the male slowly comes close to... the fridge.\""],
  "Musical": ["Play it like a musical: when something exciting happens, sing it instead of saying it, with moves.", "\"I'm hungry! 🎵 So hungry, oh oh, hungry!\""],
  "Horror movie": ["Play it like a horror movie: make scary music with your mouth, and make bad decisions on purpose.", "\"A noise in the basement? Let's go down alone, without a flashlight.\""],
  "Old detective film": ["Play it like a detective in an old black and white film: talk slowly and sadly, and say your thoughts out loud.", "\"She walked into my office. I knew it would end badly. It always ends badly.\""],
  "TV shopping channel": ["Play it like sellers on a TV shopping channel: a simple object is the most amazing product in the world. Everyone must buy it now.", "\"Only today! A cup! It holds water! Call in the next five minutes and get a fork too!\""],
  "Cartoon hero": ["Play it like a hero in a cartoon: shout the name of every move, and every small feeling is huge.", "\"Super... fridge... OPENING ATTACK!!!\""],
  "Royal palace": ["Talk in a very fancy, formal, old way, like a king and queen in a palace.", "\"Would Your Highness be so kind as to pass me the salt?\""],
  "Reality show": ["Play it like a reality show: sometimes turn to the 'camera' (the audience) and gossip about your partner.", "(to the audience) \"Listen, she thinks I can't see her. I see everything.\""],
  "Silent movie": ["No talking at all. Tell everything with your face and big movements.", "(point at the clock, hold your head in despair)"],
  "True crime show": ["One of you is the narrator of a crime show who tells dramatically what went wrong. The other acts out what happened.", "\"It was a normal Tuesday. Nobody knew the coffee was about to spill.\""],
  "A to Z": ["Each sentence starts with the next letter of the alphabet. The first starts with A, the next with B, and so on.", "\"Are you hungry?\" \"Bring me food.\" \"Cake or pizza?\""],
  "One word": ["Build sentences together: each person says one word on their turn.", "\"I\" \"want\" \"pizza\" \"with\" \"fish\""],
  "Only questions": ["You can only ask questions. No answers, no normal sentences.", "\"What are you doing here?\" \"Why do you want to know?\""],
  "Three words": ["Pick three words together. You may only say those words the whole scene. Only the tone changes.", "\"Banana? Banana! Banana...\""],
  "Translator": ["One player speaks a made-up language (gibberish) with lots of feeling. The other 'translates' for the audience.", "\"Bella pinky shmoto!\" \"He says he misses his mother.\""],
  "Sound effects": ["Every sentence comes with a sound effect that you make with your mouth.", "\"I open the door (creeeak) and the dog runs in (woof woof)!\""],
  "Super polite": ["Whatever happens, you are the most polite people in the world, like a butler.", "\"I am terribly sorry, sir, but your car is on fire.\""],
  "No yes, no no": ["You can never say the words 'yes' or 'no'. Whoever says one, made a mistake.", "Instead of \"Yes\" say \"Of course!\" Instead of \"No\" say \"Never!\""],
  "Echo": ["After each sentence, repeat its last word three times, each time softer, like an echo.", "\"Where is the money? Money... money... money...\""],
  "Spokesperson": ["Never answer a question directly. Change the subject and talk in slogans.", "\"Did I eat the cake? Great question. The people want change!\""],
  "Take it back": ["Say a sentence, and right away 'correct' it to the opposite.", "\"I love cats. No, the opposite. I hate cats.\""],
  "Third person": ["Each player talks about themselves by name, like a commentator talking about someone else.", "\"Dana is not happy. Dana wants to talk to the manager.\""],
  "Puppets": ["The players are like puppets. People in the audience call out moves (\"jump!\", \"sit down!\"), the players do them and explain in the scene why they did it.", "(someone shouts \"dance!\") \"Yes, I always dance when I'm nervous!\""],
  "Word helpers": ["When you are stuck, point at someone in the audience. They call out a word. Continue your sentence with that word.", "\"And then I...\" (point) \"Chicken!\" \"...and then I turned into a chicken.\""],
  "Secret notes": ["Before the scene the audience writes 5 notes with sentences. Pull out a note and use the sentence in the scene like it is natural.", "(pull a note) \"The bucket is full of vegetables.\" \"Exactly! That's why I quit.\""],
  "The book": ["Hold a real book. On your turn read a random sentence from it, and use it like it's what you wanted to say.", "\"So what do you think?\" (reads from the book) \"The rain fell on the old city.\""],
  "Status switch": ["One of you acts like a king (confident, giving orders, taking space), the other like a nobody (sorry, small, asking permission). Halfway through, switch: the nobody becomes the king.", "\"Stand here and don't move!\" \"Yes, sorry, right away...\" Halfway: \"You! Carry my bag!\""],
  "No eye contact": ["Never look each other in the eyes. Stand side by side.", "(side by side, looking at the ceiling) \"So... did you finish the report?\""],
  "Slow motion": ["Move very very slowly, like slow motion, but talk at normal speed.", "(lifting a cup for ten seconds) \"Hurry up, we are late!\""],
  "One object": ["Both players pretend to hold the same imaginary object (a box, a big map, a cake). If one of you lets go, the story suddenly changes.", "(one hand lets go) \"Wait, we are on the moon!\""],
  "Mirror": ["One player copies every move of the other exactly, like a mirror, while they argue.", "(both lift a hand together) \"I'm right!\" \"No, I'm right!\""],
  "Big and small": ["Without saying it, one acts very confident, the other acts very shy. Show it only with your body.", "(one stands straight and calm, the other looks at the floor) \"So... how was your weekend?\""]
};

/* ---------- Guided closing talk ----------
   No conclusions about who is good at what, no promises of change,
   and only write down what the group agrees to share. */
const MM_DEBRIEF2 = {
  /* when: swaps / topics / freezes / con / any. {con} = a constraint that was played */
  openers: [
    { when: "any", q: "Which moment from the game stays in your head?" },
    { when: "swaps", q: "Think of one time you heard 'Swap'. What happened right after?" },
    { when: "topics", q: "When a new twist came in the middle of a scene, how did you continue?" },
    { when: "freezes", q: "After 'Freeze', when someone new came into the scene, what changed?" },
    { when: "con", q: "In one scene you had to play '{con}'. What happened because of that rule?" }
  ],
  themes: [
    { key: "listen", ic: "👂", label: "Listen and build together", qs: ["Think of a moment when someone offered something in a scene. How did the other person react, and what happened next?", "At work, when should we listen to an idea a bit longer before we say no?"], note: "You don't have to agree with every idea. Listen and ask before you decide." },
    { key: "change", ic: "🔀", label: "Changing direction", qs: ["When the scene changed direction, what helped you continue and what made it hard?", "When something changes at work at the last minute, what helps us continue?"], note: "" },
    { key: "try", ic: "🎯", label: "Trying when you're not sure", qs: ["Was there a moment you didn't know what to say or do? If so, what happened next?", "What can we do at work to make it easier to say 'I don't know' or 'I was wrong'?"], note: "" },
    { key: "help", ic: "🤝", label: "Helping without taking over", qs: ["Was there a moment when someone helped the scene keep going? What exactly did they do?", "Where at work could we help each other like this? How would we know it helped?"], note: "" },
    { key: "know", ic: "👋", label: "Getting to know each other", qs: ["How was it to meet your team in a game instead of in tasks?", "Is there something from today you want in a normal work day too?"], note: "" },
    { key: "lead", ic: "🧭", label: "Leading and making room", qs: ["Who decided where the scene goes? When did that work well, and when less well?", "At work, when do we need one person to lead, and when should more people lead?"], note: "" }
  ],
  close: [
    "What, if anything, would you like to take from the game?",
    "Is there one small thing from this talk worth trying at work?",
    "If there is an idea: when will we try it, and when will we check if it helped?",
    "What from this do you agree I can write in the summary?"
  ],
  script: {
    open: "Let's take ten minutes to remember what happened and see if there is something worth taking back to work, without deciding from the game who is good at what.",
    rules: "You can talk about something that was less fun too, you can skip, and people who only watched are welcome to join in.",
    record: "The summary we share will include only what you agree to, and no comments will be linked to names.",
    bridge: "Does this moment remind you of something in our work, or does it stay in the game for you?",
    silence: "Take a moment to think. No big answer needed, one moment you remember is enough.",
    pairs: "Talk for half a minute in pairs, then we'll hear an example from anyone who wants.",
    dominate: "Let me pause here so we can hear voices we haven't heard yet.",
    personal: "Let's stop talking about the person themselves. If something here needs attention, we'll decide how to handle it separately.",
    end: "If there is a small thing we want to try, let's word it together and agree what goes in the summary. If not, we finish here without inventing a decision."
  }
};

/* ---------- Lite mode: everyday stages, who is who, opening lines ----------
   Each stage: place, one small problem, two characters (character 1 starts), and an opening line for each. */
const MM_LITE_SET = [
  { place:"A meeting that runs too long", prob:"The meeting was supposed to end half an hour ago.",
    roles:["The meeting leader, who has a few more small things","An employee who must leave right now"],
    lines:["Just three more small things and we're done.","Just so you know, my bus leaves in ten minutes."] },
  { place:"The office kitchen", prob:"The milk is finished, and the coffee is already poured.",
    roles:["The one who just used the last milk","The one who came to make coffee"],
    lines:["Oh, perfect timing. I have something small to tell you.","Good morning! Where is the milk?"] },
  { place:"Customer service call", prob:"The customer has been on hold for 40 minutes.",
    roles:["A service agent who just started the shift","A customer who has waited 40 minutes"],
    lines:["Hello, customer service, how can I help?","Forty minutes. Forty. Minutes."] },
  { place:"Planning the team day out", prob:"The plan must be ready today, and not everyone wants to come.",
    roles:["The event planner, with a big idea","An employee who doesn't want to come"],
    lines:["I have an idea for a team day nobody will forget.","Small question: do we have to come?"] },
  { place:"Late for a meeting", prob:"One of you is twenty minutes late, and has an excuse.",
    roles:["The one who is late, with a long excuse","The one who waited twenty minutes"],
    lines:["You won't believe what happened to me on the way.","Twenty minutes. OK, I'm listening."] },
  { place:"Restaurant, wrong order", prob:"A totally different dish arrived.",
    roles:["A waiter who is sure everything is fine","A diner who got the wrong dish"],
    lines:["Here you go, enjoy! Is everything OK?","Sorry, this is not what I ordered."] },
  { place:"The office air conditioner", prob:"There is one remote, and two people with opinions.",
    roles:["The one who is cold","The one who is hot"],
    lines:["Can we turn the AC down a bit? It's freezing in here.","Wait, who is touching the remote?"] },
  { place:"Planning vacation days", prob:"Everyone wants the same week off.",
    roles:["An employee who wants time off over the holidays","A manager who already got five requests"],
    lines:["I have a small request about the holidays.","Don't say it. The holidays, right?"] },
  { place:"First day at a new job", prob:"It's day one, and there's no time to explain everything.",
    roles:["The mentor, in a hurry to a meeting","The new employee, with lots of questions"],
    lines:["Welcome! I have exactly three minutes to explain everything.","Great. So where is the bathroom, and what do I actually do here?"] },
  { place:"Car pool to work", prob:"The passenger is late again, and there is traffic.",
    roles:["The driver who waited downstairs","The passenger getting into the car out of breath"],
    lines:["Good morning. I waited. Again.","Sorry sorry sorry, the elevator got stuck."] },
  { place:"Gym", prob:"First day at the gym, and the trainer is too excited.",
    roles:["A very excited personal trainer","A client on their first day"],
    lines:["Great! Today we just do a light warm-up: fifty laps.","Wait, fifty? I only came to look."] },
  { place:"Last minute presentation", prob:"The presentation is in ten minutes, and the slides haven't arrived.",
    roles:["The one presenting in ten minutes","The one who still hasn't sent the slides"],
    lines:["Are the slides ready? I'm on stage in ten minutes.","Yes, yes, they're almost ready. Almost."] },
  { place:"Spaceship", prob:"One of you is out of oxygen, and there is one tank.",
    roles:["An astronaut who still has oxygen","An astronaut who is out of oxygen"],
    lines:["Houston, we have a small problem.","A small problem? I have no air!"] }
];
/* Personal task in the middle of the scene (for one named player): something to feel and do, not a rule to remember */
const MM_LITE_TASK = [
  "From now on you are in a big hurry","From now on you are way too polite","From now on you whisper","From now on everything seems funny to you",
  "From now on you keep saying sorry","From now on you are very tired","From now on you are suspicious","From now on everything excites you",
  "From now on you are sure you are right","From now on you try to end the conversation"
];
/* Light host intro at the start of a team game (text on screen) */
const MM_LITE_INTRO = [
  "Hi, I'm your host. No pressure: nobody here is an actor, and that's the whole idea.",
  "Two people come up, get a place, who is who, and an opening line each. Say your line, then just talk like you are really there.",
  "You don't need to be funny. The one who listens to the other, wins. And simple English is perfect. Who's first?"
];

/* Personal style: added to one player mid-round. About behavior and type, never about groups */
const MM_LITE_STYLE = [
  "From now on you are a tough action hero","From now on you are a science professor","From now on you are a strict sports coach, all orders","From now on you are very fancy",
  "From now on you are super dramatic","From now on you are a philosopher","From now on you talk like a news reporter","From now on you are a loud market seller",
  "From now on you are a sweet grandma or grandpa","From now on you are excited like a five year old"
];

/* ---------- Group warm-up ----------
   Everyone at once, nobody alone in front of an audience. tier: quiet = no words, pair = pairs, group = whole group.
   open = in the "other task" draw at the start. secs 0 = no timer ("We did it!" button).
   swap = "Switch!" beep halfway (and with items, a new prompt). stages = steps that change during the timer.
   stagesFromItems = the steps are the prompts themselves (they change during the timer). */
const MM_WARMUP = [
  { id: 1, n: "Freeze photo", ic: "📸", tier: "quiet", open: true, seat: true, secs: 5,
    how: "When the countdown ends, everyone freezes in a pose of:",
    items: ["A wedding!", "The elevator is stuck!", "We won the lottery!", "The boss walks in!", "Goal in the last minute!", "A spider on the table!", "Class photo", "Monday morning"],
    kidsItems: ["A wedding!", "The elevator is stuck!", "We won the lottery!", "The teacher is at the door!", "Goal in the last minute!", "A spider on the table!", "Class photo", "Monday morning"],
    end: "Freeze! 📸 Three seconds, don't move" },
  { id: 2, n: "Mirror", ic: "🪞", tier: "quiet", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "One person moves slowly. The other is the mirror and does exactly the same. At the beep, switch." },
  { id: 3, n: "Imaginary gift", ic: "🎁", tier: "quiet", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "Hand over an imaginary box. The one who gets it opens it, decides what's inside, and says a huge thank you. At the beep, switch.",
    ex: "Wow, an umbrella for my cat! I always wanted one!" },
  { id: 4, n: "Emotion meter", ic: "🎚️", tier: "quiet", open: true, seat: true, secs: 9,
    how: "Everyone shows it with face and hands, no words:",
    items: ["Surprised", "Offended", "Excited", "Hungry", "Scared", "Proud", "Bored"],
    stages: ["Level 1", "Level 5", "Level 10!"] },
  { id: 5, n: "Market of weird products", ic: "🛒", tier: "group", open: true, seat: true, secs: 30,
    how: "You are at a market! Everyone sells a strange product at the same time, out loud.",
    ex: "Socks for snakes! Umbrellas for fish! Only two dollars!" },
  { id: 6, n: "What's going on here?", ic: "🖼️", tier: "pair", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "Describe what is happening in the picture, but make up a funny wrong story. At the beep, switch.",
    items: ["🦷 A dentist checking a child", "💍 A bride and groom at the wedding", "🏋️ Someone lifting weights", "🛒 A long line at the supermarket", "✈️ People getting on a plane", "🧺 A family picnic in the park", "👶 A teacher reading a story to kids", "💼 A team meeting around a table"],
    kidsItems: ["🦷 A dentist checking a child", "💍 A bride and groom at the wedding", "🏋️ Someone lifting weights", "🛒 A long line at the supermarket", "✈️ People getting on a plane", "🧺 A family picnic in the park", "👶 A teacher reading a story to kids", "🏫 Kids playing at recess"],
    ex: "A dentist? No, this is a hair salon for sharks. He is checking if the teeth need a trim." },
  { id: 7, n: "Made-up language", ic: "🗣️", tier: "pair", pair: true, open: false, seat: true, secs: 30, swap: true,
    how: "Say the sentence in a made-up language, with faces and full confidence. The other guesses what you said. At the beep, switch.",
    items: ["I left my keys in the car", "You have to taste this", "Who ate my yogurt?", "I have amazing news", "Sorry, that's my seat"] },
  { id: 8, n: "Yes, and...", ic: "✅", tier: "pair", pair: true, open: true, seat: true, secs: 45,
    how: "Plan together what's on the screen. Every sentence must start with \"Yes, and...\"",
    items: ["A surprise party", "A school trip to the moon", "The cat's wedding", "A restaurant on wheels", "A fun day inside a fridge"],
    ex: "Let's bring a cake. Yes, and the cake is as tall as a house. Yes, and we eat it with a crane." },
  { id: 9, n: "Word by word story", ic: "📖", tier: "pair", pair: true, open: true, seat: true, secs: 45,
    how: "Tell a story together. Each person says only one word at a time. Start from the line on the screen.",
    items: ["Once upon a time, inside a fridge...", "On the day the computer started talking...", "On the morning the coffee ran out...", "When the cat got a promotion..."] },
  { id: 10, n: "Only questions", ic: "❓", tier: "pair", pair: true, open: true, seat: true, secs: 40,
    how: "Talk only in questions. Someone said a sentence that's not a question? Start again.",
    items: ["What's for lunch today?", "Where is the parking?", "Who left this here?", "Why is everyone looking at me?"] },
  { id: 11, n: "Great idea!", ic: "💡", tier: "pair", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "One person suggests a bad idea. The other says \"What a great idea!\" and adds one more detail. At the beep, switch.",
    ex: "\"Let's move into the fridge.\" \"What a great idea! And we'll invite the neighbors to the freezer.\"" },
  { id: 12, n: "World expert", ic: "🎓", tier: "pair", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "One asks the question on the screen, the other answers like a famous professor. At the beep, switch, with a new question.",
    items: ["Why do cats have whiskers?", "Where do lost socks go?", "Why is the office coffee always cold?", "How do you know a cake is ready?", "Why do people shout on the phone?", "Why does the other line always move faster?"],
    kidsItems: ["Why do cats have whiskers?", "Where do lost socks go?", "Why do we have to go to bed early?", "How do you know a cake is ready?", "Why do zebras have stripes?", "Why does the other line always move faster?"] },
  { id: 13, n: "The object's secret", ic: "🤫", tier: "pair", pair: true, open: false, seat: true, secs: 40, swap: true,
    how: "Quietly tell a made-up secret about the object on the screen. At the beep, switch, with a new object.",
    items: ["Your chair", "The closest bottle", "The air conditioner", "The closest pen", "The door of this room", "The lamp"] },
  { id: 14, n: "TV ad", ic: "✨", tier: "pair", pair: true, open: true, seat: true, secs: 40, swap: true,
    how: "Pick something you have on you (a key, a pen, a shoe). Sell it like an invention that will change the world. At the beep, switch.",
    ex: "This is not just a key. This is a key that opens DOORS!" },
  { id: 15, n: "Dramatic reading", ic: "🎭", tier: "pair", pair: true, open: true, seat: true, secs: 60,
    how: "Read the line on the screen in the style written under it. With each new style, switch who reads.",
    items: ["Please don't leave dishes in the sink", "The meeting moved to three o'clock", "The printer is not working", "Who took my charger?"],
    kidsItems: ["Please don't run in the hallway", "There is a test tomorrow", "Who took my eraser?", "Time to clean your room"],
    stages: ["Like a sports commentator", "Like a soap opera", "Like breaking news", "Like a victory speech"] },
  { id: 16, n: "Nice to meet you", ic: "🤝", tier: "pair", pair: true, open: false, seat: true, secs: 40, swap: true,
    how: "Introduce yourselves to each other as if you met at the place on the screen. At the beep, switch.",
    items: ["A meeting for people who love snails", "A competition for the best nap", "An alien school reunion", "A club for people who love waiting in line"] },
  { id: 17, n: "Whisper to shout", ic: "📢", tier: "group", open: false, seat: true, secs: 6,
    how: "Everyone says the word together again and again. Start with a whisper and end with a shout.",
    items: ["Banana", "Yes!", "Goooal", "Break time!", "Happy Friday"],
    stages: ["Whisper...", "Louder...", "Shout!"] },
  { id: 18, n: "Changing channels", ic: "📺", tier: "group", open: false, seat: true, secs: 30,
    how: "The place changes every 5 seconds. Everyone reacts with face, hands and voice.",
    items: ["The beach", "A library", "A roller coaster", "Inside a fridge", "A huge concert", "A stuck elevator", "A waiting room", "Sudden rain"],
    stagesFromItems: true },
  { id: 19, n: "Count to 10", ic: "🔢", tier: "group", open: false, seat: true, secs: 0,
    how: "Close your eyes or look at the floor. Count to 10 together, each time a different person says one number. Two people spoke at once? Back to one.",
    note: "Best for groups of up to 15. Not funny, but it connects the room." },
  { id: 20, n: "Group machine", ic: "⚙️", tier: "group", open: false, seat: false, secs: 0,
    how: "One person starts a movement with a sound. One by one, each person joins and connects to the machine, until everyone is in.",
    items: ["A coffee machine", "A washing machine", "A chocolate factory", "A machine that makes Fridays"],
    note: "Here each person stands out for a moment. Only for a group that is already warmed up." },
  { id: 21, n: "Stadium crowd", ic: "🏟️", tier: "group", open: true, seat: true, secs: 30,
    how: "You are the crowd at a big sports game. Every 5 seconds something new happens, and everyone reacts together.",
    items: ["Goal!", "Missed by one meter", "The referee stops the game", "Extra time!", "Our team wins the league!", "The goalkeeper saves a penalty", "Stadium wave!", "A tie in the last minute"],
    stagesFromItems: true },
  { id: 22, n: "Good news, bad news", ic: "🎉", tier: "group", open: true, seat: true, secs: 40, ordered: true,
    how: "The screen announces news. Everyone reacts together: celebrate when it's good, be disappointed when it's bad.",
    items: ["We get a day off tomorrow! 🎉", "...but only until 7 AM 😩", "There's cake in the kitchen! 🎂", "...it's from yesterday's birthday 😬", "Everyone gets a bonus! 💰", "...a free coffee ☕", "We're all flying abroad! ✈️", "...to the next town 😅"],
    kidsItems: ["No school tomorrow! 🎉", "...because there's a 10 km hike 😩", "There's cake in class! 🎂", "...it's from yesterday's birthday 😬", "We got a present! 🎁", "...a new notebook 📓", "Recess time! 🛝", "...for one minute 😅"],
    stagesFromItems: true },
  { id: 23, n: "Body vote", ic: "🙋", tier: "group", open: true, seat: true, secs: 30,
    how: "Quick questions. Vote with your body, no words, and see who is like you.",
    items: ["Coffee? ✋ hand up · Tea? 👋 wave", "Beach? ✋ hand up · Mountains? 👋 wave", "Morning? ✋ hand up · Night? 👋 wave", "Cats? ✋ hand up · Dogs? 👋 wave", "Pizza? ✋ hand up · Sushi? 👋 wave", "Summer? ✋ hand up · Winter? 👋 wave", "Pancakes? ✋ hand up · Waffles? 👋 wave", "Shower in the morning? ✋ hand up · At night? 👋 wave"],
    stagesFromItems: true },
  { id: 24, n: "The orchestra", ic: "🎻", tier: "group", open: true, seat: true, secs: 24,
    how: "Everyone picks a sound of an instrument (drum, trumpet, violin, something you invent). The screen is the conductor: do exactly what it says.",
    stages: ["Start, softly...", "Louder...", "Only the right side of the room!", "Only the left side!", "Everyone, loudest!", "Stop! ✋"] },
  { id: 25, n: "A to Z line-up", ic: "📅", tier: "group", open: false, seat: false, secs: 0,
    how: "Everyone lines up by the first letter of their first name, from A to Z. No talking, only hand signs.",
    note: "Takes about 2 minutes. Connects the room a lot. At the end, check out loud if you got it right." },
  { id: 26, n: "Everyone agrees", ic: "📣", tier: "group", open: true, seat: true, secs: 10,
    how: "A crazy statement is on the screen. Everyone reacts together as written under it.",
    items: ["Pineapple pizza is the official office food", "From now on, meetings only standing on one leg", "The neighbor's cat is the new manager", "Tomorrow everyone comes in pajamas", "Coffee is a vegetable"],
    kidsItems: ["Pineapple pizza is the official school food", "From now on, homework only by singing", "The neighbor's cat is the new teacher", "Tomorrow everyone comes in pajamas", "Chocolate is a vegetable"],
    stages: ["Everyone agrees with excitement! 🙌", "Everyone in total shock! 😱"] }
];
/* The fixed opening set: quiet, pairs, whole group. "Other task" draws from the same tier (open:true). */
const MM_WARMUP_OPEN = [1, 8, 21];
/* Recommended for coming back mid-game */
const MM_WARMUP_MID = [22, 23, 24, 4, 15];
const MM_WARMUP_TIER = { quiet: "No words", pair: "In pairs", group: "Whole group" };
const MM_WARMUP_PAIR = "Pair up with the person next to you. Alone? Join a pair. Whoever's first name comes first in the alphabet starts.";
