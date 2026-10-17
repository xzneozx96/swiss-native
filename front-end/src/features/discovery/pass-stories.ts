/**
 * The five pass stories (from the client's guide "Five Alpine Passes with Erich",
 * 17.10.2026), retold in Erich's own voice. The historic facts are the guide's (Goldfinger
 * 1964, Sbrinz by pack animal, the Susten road 1939 to 1946, the Tremola's 24 hairpins,
 * the Nufenen road 1965 to 1969); the scenes are imagined, as in the guide. Like the home
 * text, the pages are shown with the story voice note, because Erich did not write them.
 */
export type PassId = "furka" | "grimsel" | "susten" | "gotthard" | "nufenen";

export const PASS_IDS: PassId[] = [
  "furka",
  "grimsel",
  "susten",
  "gotthard",
  "nufenen",
];

export const isPassId = (id: string): id is PassId =>
  (PASS_IDS as string[]).includes(id);

/** Pass heights in metres, as on the home strip. */
export const PASS_HEIGHTS: Record<PassId, number> = {
  furka: 2429,
  grimsel: 2165,
  susten: 2224,
  gotthard: 2107,
  nufenen: 2478,
};

/** Photo slugs of a pass: the first is the hero, all five make the gallery. */
export const passPhotos = (id: PassId) =>
  [1, 2, 3, 4, 5].map((n) => `story-${id}-${n}`);

export interface PassStory {
  name: string;
  /** Three words, as in the guide's contents. */
  themes: string;
  tagline: string;
  heroAlt: string;
  paragraphs: string[];
  closerTitle: string;
  closer: string;
  /** One caption per photo of the gallery. */
  captions: string[];
}

export interface PassesCopy {
  index: {
    kicker: string;
    title: string;
    subtitle: string;
    paragraphs: string[];
    chapters: string;
    coverAlt: string;
    journeyKicker: string;
    journeyTitle: string;
    journey: string[];
    ctaTitle: string;
    ctaBody: string;
    ctaAction: string;
    ctaSubject: string;
    notice: string;
  };
  ui: {
    back: string;
    readStory: string;
    closerLook: string;
    chapter: (n: number, total: number) => string;
    next: string;
    previous: string;
    all: string;
    seeAll: string;
  };
  stories: Record<PassId, PassStory>;
}

export const passesCopy: Record<"en" | "de", PassesCopy> = {
  en: {
    index: {
      kicker: "Five passes · five stories",
      title: "A country that stays with you",
      subtitle: "Local stories. Open roads. Lasting memories.",
      paragraphs: [
        "Some countries come back to us as a photograph. Others come back as a sound: a distant cowbell, a conversation in a village, the quiet when a motorcycle engine stops high in the mountains.",
        "For me, Switzerland is made of moments like these. I am a Swiss local who loves to travel by motorbike and to work with my hands, so these landscapes are everyday life to me as much as adventure.",
        "Furka, Grimsel, Susten, Gotthard and Nufenen are five different chapters. One starts with cinema and a glacier. Another follows cheese across the Alps. A third shows the skill of the road builders. The cobbles of the Tremola hold the memory of generations, and the Nufenen opens a way between languages and valleys.",
        "Take your time with them. There is room for big views and for slower moments: a stop with a reason, a shared meal, a question that turns into a conversation.",
      ],
      chapters: "Your five chapters",
      coverAlt: "The Tremola, the cobbled road of the Gotthard, from above",
      journeyKicker: "Make the journey your own",
      journeyTitle: "Five roads. Your own story.",
      journey: [
        "Furka offers wonder. Grimsel shows the journeys behind familiar flavours. Susten makes you admire craftsmanship. Gotthard keeps the memory of connection alive. Nufenen makes room for curiosity and quiet.",
        "I am the thread between these landscapes. Your interests, your time and how much you ride decide where we go and how we enjoy it.",
        "A good trip leaves time to notice. The right pause can matter as much as the next pass, and so can the people you meet and the stories you bring to dinner.",
        "You may go home with beautiful photos, a small keepsake, or a story you keep telling. The deepest souvenir may be the feeling that, somewhere around a bend in the mountains, Switzerland became a part of your own memory.",
      ],
      ctaTitle: "Begin with a conversation",
      ctaBody:
        "Tell me your preferred dates, group size, riding experience and what you enjoy most. We then plan the route and the details together.",
      ctaAction: "Ask Erich",
      ctaSubject: "Planning a ride over the passes",
      notice:
        "Mountain passes open with the seasons, so the exact route depends on road openings, weather and local conditions. These five chapters describe places, not a fixed five-pass itinerary or a promise of access. We confirm riding or passenger arrangements, equipment, what is included and meeting points before you book.",
    },
    ui: {
      back: "Back",
      readStory: "Read the story",
      closerLook: "A closer look",
      chapter: (n, total) => `Chapter ${n} of ${total}`,
      next: "Next pass",
      previous: "Previous pass",
      all: "All five passes",
      seeAll: "All stories",
    },
    stories: {
      furka: {
        name: "Furka",
        themes: "Cinema · Landscape · Wonder",
        tagline: "A bend in the road. A moment out of time.",
        heroAlt: "The Belvédère building beside the Furka road",
        paragraphs: [
          "Imagine an early morning climb. The air gets cooler. The houses in the valley fall behind you, and the road starts to fold around the mountainside. One bend takes you close to the rock; the next opens onto a sky so wide that you breathe deeper without thinking.",
          "Then the Belvédère appears beside a bend. Even on a first visit the scene can feel familiar. Furka has a place in cinema history: scenes for the James Bond film Goldfinger were shot here in 1964. The pass links Valais and Uri, and its road is closely tied to the landscape of the Rhône Glacier.",
          "The most personal part begins when you stop. Gloves come off. The cold touches your fingertips. Below, the road you just rode is a slender line across an enormous landscape. For a moment you see your own journey from the outside.",
          "Furka brings a particular kind of wonder: the scale of the mountains, the daring of the road and the simple pleasure of being there. On a ride with me, I leave room for that. A good place to stop and a few unhurried minutes can turn a famous view into a memory that belongs only to you.",
        ],
        closerTitle:
          "Some views make you reach for your camera. Others make you forget it.",
        closer:
          "Years later, a photograph may bring back more than the shape of a mountain. It may bring back the cool on your face, the quiet after the engine stops, or the person standing next to you. Furka gives those small, close moments an extraordinary setting. Its cinema history is the introduction; your own experience writes the ending.",
        captions: [
          "The Belvédère building beside the Furka road.",
          "The eastern approach and the Urseren valley.",
          "A mountain panorama from the Furka area.",
          "The Rhône Glacier landscape, photographed in June 2023.",
          "The Furka road in its mountain setting.",
        ],
      },
      grimsel: {
        name: "Grimsel",
        themes: "Cheese · Trade · Perseverance",
        tagline: "The road that carried a mountain's labour.",
        heroAlt: "The Grimsel road and the Grimselsee",
        paragraphs: [
          "Grimsel has a rugged presence. Granite, water and wide mountainsides make the landscape feel shaped slowly, over an immense stretch of time. Yet one of its most telling human stories begins with something wonderfully ordinary: a piece of cheese.",
          "From the late Middle Ages, Sbrinz cheese crossed the Grimsel on pack animals, on its way to markets in northern Italy. The old mule tracks tied together producers, carriers and buyers across the mountains. A taste of home could become a livelihood far from the valley where it was made.",
          "Picture a small caravan setting out in the morning mist. The loads are carefully tied. Every step needs attention to the ground, the weather and the distance still ahead. In those bundles are months of work, a family's income and a promise to someone waiting on the other side. It is an imagined scene, but it helps me feel the effort behind an old trade route.",
          "After that story, cheese on a table has another dimension. You think of grass, milk, patient hands and long journeys. Grimsel shows a quiet kind of Swiss pride: doing a job well, keeping a promise and finding a way to connect communities that mountains keep apart.",
        ],
        closerTitle: "Before the engines came, there were hoofbeats.",
        closer:
          "With me, the landscape becomes a starting point for talking about everyday Switzerland: work, resourcefulness and how small communities depend on each other. Look at the lakes and the rock, then imagine the people who crossed here long before you. Later, at a meal, a familiar flavour may bring the whole road back. Sometimes a taste can hold a journey.",
        captions: [
          "The Grimsel road and the Grimselsee.",
          "The northern descent towards the Haslital.",
          "The Grimselsee and the Räterichsbodensee in the mountain landscape.",
          "The dam at the Grimselsee: another layer of human work.",
          "The Räterichsbodensee seen from the Grimsel route.",
        ],
      },
      susten: {
        name: "Susten",
        themes: "Engineering · Stone · Rhythm",
        tagline: "Craftsmanship written into the mountains.",
        heroAlt: "Mountain scenery along the Susten route",
        paragraphs: [
          "Some passes are remembered for a single viewpoint. Susten is remembered for the feeling of moving through it. A hillside opens, a line of rock appears, and the light changes as the road turns. On a motorbike the landscape has temperature, texture and rhythm.",
          "That flowing feeling rests on deliberate work. The modern Susten road was built between 1939 and 1946. Its builders paid attention to how it would sit in the landscape, using local materials, granite facings and a great deal of handwork. The road itself is part of what makes the ride worth noticing.",
          "You can pass a stone wall in a second. Look closer and the questions start. How were the stones fitted together? How was the line of the road chosen? What did it take to build here, where the seasons set their own hard terms? Suddenly the landscape holds people as well as mountains.",
          "This story is close to me, because I enjoy practical craftsmanship at home too. Susten shows how much care can go into something useful. Precision, durability and beauty meet in a road that rewards a thoughtful pace.",
        ],
        closerTitle:
          "A beautiful road makes you appreciate the hands that built it.",
        closer:
          "Give yourself time to notice the sequence of views, not only the summit. A change in the light, a glimpse of water or the line of a stone wall may become the detail you remember. Susten's pleasure lies in that continuity. At the end of the day you may find yourself recalling a feeling of harmony: the road, the mountain and your attention moving together.",
        captions: [
          "Mountain scenery along the Susten route.",
          "The Steinsee in the Susten landscape.",
          "“Mountain Veins”: a photographer's view of the Susten area.",
          "The Susten valley, photographed in July 2022.",
          "The Steingletscher in the high mountain landscape.",
        ],
      },
      gotthard: {
        name: "Gotthard",
        themes: "Heritage · Connection · Memory",
        tagline: "Tremola: the stones that remember.",
        heroAlt: "The cobbled surface of the old Tremola road",
        paragraphs: [
          "On the southern side of the Gotthard, the Tremola curls down the mountain in a run of cobbled bends. From far away it looks like a ribbon laid carefully across the slope. Up close, the single stones give the road a human scale.",
          "The Tremola is known for its 24 cobbled hairpin bends. It is a remarkable part of the heritage of the Gotthard crossing, for a long time an important link between the north and south of the Alps. Its meaning reaches well beyond the journey of any single traveller.",
          "Pause and imagine the people who once came this way: a merchant hoping to reach a market, a driver watching the sky, a traveller wondering which language would greet them beyond the mountains. Their reasons differed, but each depended on a route and on the work of people they might never meet.",
          "Today the shapes and surfaces of the Tremola make that history unusually tangible. The road speaks of a Switzerland joined across regions and languages. Crossing the mountains meant trade, meeting people and slowly building relationships. You can see the heritage in the care taken to keep a road whose character still matters.",
        ],
        closerTitle:
          "Here, history is something you can see beneath the wheels.",
        closer:
          "With me, you take time to look at the road from a good place to stop. Follow its curves with your eyes and notice how a piece of infrastructure becomes a cultural memory. You come away understanding the landscape you are riding through a little better. Some things are worth keeping because they help us see how far we have come.",
        captions: [
          "The cobbled surface of the old Tremola road.",
          "The historic road on the southern side of the Gotthard.",
          "The Tremola curves within the wider mountain landscape.",
          "The Tremola seen from above.",
          "A contemporary view of the historic road, August 2025.",
        ],
      },
      nufenen: {
        name: "Nufenen",
        themes: "Language · Exchange · Open space",
        tagline: "Across the wind, another Switzerland.",
        heroAlt: "High Alpine scenery around the Nufenen Pass",
        paragraphs: [
          "Nufenen brings a feeling of space. As you climb, the landscape gets simpler: clearer outlines of rock, wider stretches of sky, and a wind that makes you pull your collar up before you stand still and take it all in.",
          "The modern road was built between 1965 and 1969, linking Ulrichen with Airolo through the Val Bedretto. Long before the road, the crossing carried livestock and cheese. The asphalt is fairly young; the urge to reach the next valley is much older.",
          "Nufenen also has an Italian name, Passo della Novena. The two names hint at one of Switzerland's great pleasures: the landscape stays unmistakably Alpine while the language and the cultural mood change. Riding from Valais into Ticino takes you into the Italian-speaking part of the country.",
          "Meet that change with curiosity. Listen to how a place name is pronounced. Notice a greeting. Ask about something on a menu when you get the chance. Small encounters show the variety inside a country that can seem familiar from photographs. Nufenen gives that discovery a magnificent mountain setting.",
        ],
        closerTitle:
          "One crossing. Two valleys. A new way of hearing the country.",
        closer:
          "At a good stop near the top, let a little silence be yours. Perhaps you will think about the road ahead, or about someone you would like to bring here. Perhaps, for the first time in days, you will have no need to think about anything at all. That freedom is part of what a journey is worth. A pass connects two places; sometimes it also brings you back to yourself.",
        captions: [
          "High Alpine scenery around the Nufenen Pass.",
          "Looking west from the Nufenen area.",
          "A mountain lake at Nufenen.",
          "Looking east from the Nufenen area.",
          "Flags at Nufenen: a small detail in a vast setting.",
        ],
      },
    },
  },
  de: {
    index: {
      kicker: "Fünf Pässe · fünf Geschichten",
      title: "Ein Land, das in Ihnen weiterlebt",
      subtitle: "Geschichten von hier. Freie Fahrt. Bleibende Erinnerungen.",
      paragraphs: [
        "Manche Länder kehren als Foto zu uns zurück. Andere als Klang: eine ferne Kuhglocke, ein Gespräch im Dorf, die Stille, wenn hoch in den Bergen ein Motorradmotor verstummt.",
        "Für mich besteht die Schweiz aus solchen Momenten. Ich bin hier zu Hause, ich reise gern mit dem Motorrad und arbeite gern mit den Händen. Diese Landschaften sind für mich ebenso Alltag wie Abenteuer.",
        "Furka, Grimsel, Susten, Gotthard und Nufenen sind fünf verschiedene Kapitel. Eines beginnt mit Kino und einem Gletscher. Ein anderes folgt dem Käse über die Alpen. Ein drittes zeigt das Können der Strassenbauer. Die Steine der Tremola bewahren die Erinnerung an Generationen, und der Nufenen verbindet Sprachen und Täler.",
        "Nehmen Sie sich Zeit dafür. Es bleibt Raum für grosse Ausblicke und ruhige Momente: einen Halt mit Grund, ein gemeinsames Essen, eine Frage, aus der ein Gespräch entsteht.",
      ],
      chapters: "Ihre fünf Kapitel",
      coverAlt: "Die Tremola, die gepflasterte Strasse am Gotthard, von oben",
      journeyKicker: "Ihre ganz persönliche Reise",
      journeyTitle: "Fünf Strassen. Ihre Geschichte.",
      journey: [
        "Die Furka lässt Sie staunen. Die Grimsel zeigt die Wege hinter vertrauten Aromen. Der Susten weckt Bewunderung für das Handwerk. Der Gotthard hält die Erinnerung an Verbindungen lebendig. Der Nufenen schenkt Raum für Neugier und Stille.",
        "Ich bin der Faden zwischen diesen Landschaften. Ihre Interessen, Ihre Zeit und Ihre Fahrerfahrung entscheiden, wohin wir fahren und wie wir es geniessen.",
        "Eine gute Reise lässt Zeit zum Wahrnehmen. Die richtige Pause kann ebenso wichtig sein wie der nächste Pass, und ebenso die Menschen, denen Sie begegnen, und die Geschichten, die Sie zum Abendessen mitbringen.",
        "Vielleicht kehren Sie mit schönen Fotos zurück, einem kleinen Andenken oder einer Geschichte, die Sie immer wieder erzählen. Die tiefste Erinnerung ist womöglich das Gefühl, dass die Schweiz irgendwo an einer Bergkurve ein Teil Ihrer eigenen Geschichte geworden ist.",
      ],
      ctaTitle: "Am Anfang steht ein Gespräch",
      ctaBody:
        "Erzählen Sie mir von Ihren Wunschdaten, der Gruppengrösse, Ihrer Fahrerfahrung und dem, was Ihnen Freude macht. Route und Einzelheiten planen wir dann gemeinsam.",
      ctaAction: "Erich fragen",
      ctaSubject: "Eine Fahrt über die Pässe planen",
      notice:
        "Alpenpässe sind saisonal befahrbar. Die konkrete Route hängt von Strassenöffnungen, Wetter und örtlichen Bedingungen ab. Diese fünf Kapitel beschreiben Orte, sie sind weder ein fester Fünf-Pässe-Reiseplan noch eine Zufahrtsgarantie. Selbstfahren oder Mitfahren, Ausrüstung, Leistungen und Treffpunkte klären wir vor der Buchung.",
    },
    ui: {
      back: "Zurück",
      readStory: "Geschichte lesen",
      closerLook: "Genauer hingesehen",
      chapter: (n, total) => `Kapitel ${n} von ${total}`,
      next: "Nächster Pass",
      previous: "Vorheriger Pass",
      all: "Alle fünf Pässe",
      seeAll: "Alle Geschichten",
    },
    stories: {
      furka: {
        name: "Furka",
        themes: "Kino · Landschaft · Staunen",
        tagline: "Eine Kurve. Ein Augenblick ausserhalb der Zeit.",
        heroAlt: "Das Belvédère an der Furkapassstrasse",
        paragraphs: [
          "Stellen Sie sich eine Fahrt am frühen Morgen vor. Die Luft wird kühler. Die Häuser im Tal bleiben zurück, und die Strasse beginnt, sich an den Berghang zu schmiegen. Eine Kurve führt dicht am Fels entlang, die nächste öffnet den Blick in einen Himmel, der so weit erscheint, dass Sie unwillkürlich tiefer einatmen.",
          "Dann taucht das Belvédère an einer Kehre auf. Selbst beim ersten Besuch kann Ihnen dieser Anblick vertraut vorkommen. Die Furka hat ihren Platz in der Filmgeschichte: Hier entstanden 1964 Szenen für den James-Bond-Film Goldfinger. Der Pass verbindet das Wallis mit Uri; seine Strasse ist eng mit der Landschaft des Rhonegletschers verbunden.",
          "Der persönlichste Teil beginnt beim Anhalten. Sie ziehen die Handschuhe aus. Die Kälte berührt Ihre Fingerspitzen. Unter Ihnen zeichnet die eben gefahrene Strasse eine feine Linie durch die weite Landschaft. Für einen Moment sehen Sie Ihre eigene Reise von aussen.",
          "Die Furka weckt eine besondere Art des Staunens: über die Grösse der Berge, die Kühnheit der Strasse und die schlichte Freude, hier zu sein. Auf einer Fahrt mit mir lasse ich Raum für dieses Gefühl. Ein guter Halteplatz und ein paar ruhige Minuten können aus einem berühmten Ausblick eine Erinnerung machen, die ganz Ihnen gehört.",
        ],
        closerTitle:
          "Manche Ausblicke lassen Sie zur Kamera greifen. Andere lassen Sie die Kamera vergessen.",
        closer:
          "Jahre später ruft ein Foto vielleicht mehr in Ihnen wach als die Umrisse eines Berges: die Kühle auf Ihrem Gesicht, die Stille nach dem Abstellen des Motors oder den Menschen neben Ihnen. Die Furka gibt diesen kleinen, persönlichen Momenten eine aussergewöhnliche Kulisse. Ihre Filmgeschichte bildet den Auftakt; wie Ihre eigene Geschichte weitergeht, erleben Sie selbst.",
        captions: [
          "Das Belvédère an der Furkapassstrasse.",
          "Die östliche Zufahrt und das Urserental.",
          "Ein Bergpanorama aus dem Furkagebiet.",
          "Die Landschaft am Rhonegletscher im Juni 2023.",
          "Die Furkastrasse in ihrer Berglandschaft.",
        ],
      },
      grimsel: {
        name: "Grimsel",
        themes: "Käse · Handel · Ausdauer",
        tagline: "Der Weg, der die Arbeit der Berge weitertrug.",
        heroAlt: "Die Grimselstrasse und der Grimselsee",
        paragraphs: [
          "Die Grimsel hat eine herbe Schönheit. Granit, Wasser und weite Berghänge lassen eine Landschaft erkennen, die über unermesslich lange Zeit geformt wurde. Eine ihrer eindrücklichsten menschlichen Geschichten beginnt jedoch mit etwas wunderbar Alltäglichem: einem Stück Käse.",
          "Seit dem späten Mittelalter wurde Sbrinz auf Saumtieren über die Grimsel zu den Märkten Norditaliens transportiert. Die alten Saumwege verbanden Produzenten, Säumer und Käufer über die Berge hinweg. Ein Geschmack aus der Heimat konnte weit jenseits des eigenen Tals zur Lebensgrundlage werden.",
          "Stellen Sie sich eine kleine Karawane im Morgennebel vor. Die Lasten sind sorgfältig befestigt. Jeder Schritt verlangt Aufmerksamkeit für den Boden, das Wetter und den Weg, der noch vor den Reisenden liegt. In den Bündeln stecken Monate Arbeit, das Einkommen einer Familie und ein Versprechen an jemanden auf der anderen Seite. Es ist ein vorgestelltes Bild, aber es macht mir die Mühen eines alten Handelswegs greifbar.",
          "Mit dieser Geschichte bekommt Käse auf dem Tisch eine weitere Bedeutung. Sie denken an Gras, Milch, geduldige Hände und lange Wege. Die Grimsel erzählt von einer stillen Form Schweizer Stolzes: seine Arbeit gut zu machen, ein Versprechen zu halten und Gemeinschaften über schwieriges Gelände hinweg miteinander zu verbinden.",
        ],
        closerTitle: "Bevor die Motoren kamen, hörte man Hufschläge.",
        closer:
          "Mit mir wird die Landschaft zum Ausgangspunkt für Gespräche über den Schweizer Alltag: über Arbeit, Einfallsreichtum und die Beziehungen zwischen kleinen Gemeinschaften. Betrachten Sie die Seen und den Fels und stellen Sie sich die Menschen vor, die lange vor Ihnen hier unterwegs waren. Später, bei einem Essen, kann ein vertrauter Geschmack plötzlich die ganze Fahrt zurückbringen. Manchmal bewahrt ein Bissen eine Reise.",
        captions: [
          "Die Grimselstrasse und der Grimselsee.",
          "Die nördliche Abfahrt ins Haslital.",
          "Grimselsee und Räterichsbodensee in der Berglandschaft.",
          "Die Staumauer am Grimselsee: eine weitere Spur menschlicher Arbeit.",
          "Der Räterichsbodensee von der Grimselroute aus gesehen.",
        ],
      },
      susten: {
        name: "Susten",
        themes: "Baukunst · Stein · Rhythmus",
        tagline: "Handwerkskunst in die Berge geschrieben.",
        heroAlt: "Berglandschaft entlang der Sustenroute",
        paragraphs: [
          "Manche Pässe bleiben wegen eines einzigen Aussichtspunkts in Erinnerung. Beim Susten ist es das Gefühl des Unterwegsseins. Ein Hang öffnet sich, eine Felslinie tritt hervor, das Licht wechselt mit der nächsten Kurve. Auf dem Motorrad hat die Landschaft Temperatur, Struktur und Rhythmus.",
          "Hinter diesem fliessenden Erlebnis steckt bewusste Arbeit. Die moderne Sustenstrasse entstand zwischen 1939 und 1946. Bei ihrer Gestaltung wurde darauf geachtet, wie sie sich in die Landschaft einfügt: mit lokalen Materialien, Granitverkleidungen und viel Handarbeit. Die Strasse selbst gehört zu dem, was diese Fahrt so sehenswert macht.",
          "Eine Steinmauer kann im Vorbeifahren kaum auffallen. Wer genauer hinsieht, beginnt sich zu fragen: Wie wurden die Steine zusammengefügt? Wie hat man die Linienführung gewählt? Was bedeutete es, an einem Ort zu bauen, an dem die Jahreszeiten so anspruchsvolle Bedingungen stellen? Plötzlich wird die Landschaft auch von den Menschen erzählt, die hier gearbeitet haben.",
          "Diese Geschichte liegt mir nah, denn auch zu Hause freue ich mich am praktischen Handwerk. Der Susten zeigt, wie viel Sorgfalt in nützlichen Dingen stecken kann. Genauigkeit, Beständigkeit und Schönheit begegnen sich auf einer Strasse, die ein aufmerksames Tempo verdient.",
        ],
        closerTitle:
          "Eine schöne Strasse lässt Sie auch die Hände würdigen, die sie gebaut haben.",
        closer:
          "Nehmen Sie sich Zeit für die Folge der Ausblicke, nicht nur für den Gipfel. Ein Lichtwechsel, ein Blick aufs Wasser oder die Linie einer Steinmauer kann zum Detail werden, das Ihnen bleibt. Der Reiz des Sustens liegt in diesem Zusammenspiel. Vielleicht erinnern Sie sich am Abend vor allem an ein Gefühl von Harmonie: Die Strasse, der Berg und Ihre Aufmerksamkeit waren für eine Weile ganz im Einklang.",
        captions: [
          "Berglandschaft entlang der Sustenroute.",
          "Der Steinsee im Sustengebiet.",
          "«Mountain Veins»: der fotografische Blick auf das Sustengebiet.",
          "Das Sustental, aufgenommen im Juli 2022.",
          "Der Steingletscher in der Hochgebirgslandschaft.",
        ],
      },
      gotthard: {
        name: "Gotthard",
        themes: "Kulturerbe · Verbindung · Erinnerung",
        tagline: "Tremola: Steine, die sich erinnern.",
        heroAlt: "Das Kopfsteinpflaster der alten Tremolastrasse",
        paragraphs: [
          "Auf der Südseite des Gotthards windet sich die Tremola in einer Folge gepflasterter Kehren den Berg hinunter. Aus der Ferne gleicht sie einem Band, das sorgfältig über den Hang gelegt wurde. Aus der Nähe geben die einzelnen Steine der Strasse ein menschliches Mass.",
          "Die Tremola ist für ihre 24 gepflasterten Haarnadelkurven bekannt. Sie gehört zum besonderen Erbe des Gotthardübergangs, der seit Langem eine wichtige Verbindung zwischen der Nord- und Südseite der Alpen bildet. Seine Bedeutung reicht weit über die Reise eines einzelnen Menschen hinaus.",
          "Halten Sie einen Moment inne und stellen Sie sich die Menschen vor, die einst hier unterwegs waren: einen Händler auf dem Weg zum Markt, einen Fuhrmann mit prüfendem Blick zum Himmel, einen Reisenden, der sich fragt, welche Sprache ihn jenseits der Berge erwartet. Ihre Ziele waren verschieden. Doch alle vertrauten auf diesen Weg und auf die Arbeit von Menschen, denen sie vielleicht nie begegnen würden.",
          "Heute machen die Formen und Oberflächen der Tremola diese Geschichte ungewöhnlich greifbar. Die Strasse erzählt von einer Schweiz, die unterschiedliche Regionen und Sprachen miteinander verbindet. Über die Berge zu reisen bedeutete Handel, Begegnung und das allmähliche Entstehen von Beziehungen. Die Sorgfalt, mit der dieser Weg erhalten wird, zeigt, wie viel sein Charakter noch immer bedeutet.",
        ],
        closerTitle: "Hier liegt Geschichte sichtbar unter den Rädern.",
        closer:
          "Mit mir nehmen Sie sich an einem guten Halteplatz Zeit für den Blick auf die Strasse. Folgen Sie ihren Kurven mit den Augen und entdecken Sie, wie ein Verkehrsweg zu einem kulturellen Gedächtnis wird. Die Landschaft gewinnt dadurch an Tiefe. Manche Dinge bewahren wir, weil sie uns erkennen lassen, wie weit wir gekommen sind.",
        captions: [
          "Das Kopfsteinpflaster der alten Tremolastrasse.",
          "Die historische Strasse auf der Südseite des Gotthards.",
          "Die Kurven der Tremola in der weiten Berglandschaft.",
          "Blick auf die Tremola im Abendlicht.",
          "Die historische Strasse, aufgenommen im August 2025.",
        ],
      },
      nufenen: {
        name: "Nufenen",
        themes: "Sprache · Austausch · Weite",
        tagline: "Jenseits des Windes eine andere Schweiz.",
        heroAlt: "Hochalpine Landschaft rund um den Nufenenpass",
        paragraphs: [
          "Der Nufenen schenkt ein Gefühl von Weite. Mit jedem Höhenmeter wird die Landschaft klarer: schärfere Felskonturen, grössere Himmelsflächen und ein Wind, der Sie den Kragen etwas höher ziehen lässt, bevor Sie stehen bleiben und den Blick schweifen lassen.",
          "Die moderne Strasse wurde zwischen 1965 und 1969 gebaut. Sie verbindet Ulrichen über das Bedrettotal mit Airolo. Lange bevor es diese Strasse gab, wurden über den Übergang Vieh und Käse transportiert. Der Asphalt ist vergleichsweise jung; der Wunsch, das nächste Tal zu erreichen, ist viel älter.",
          "Der Nufenen trägt auch den italienischen Namen Passo della Novena. Die beiden Namen deuten auf einen besonderen Reiz der Schweiz hin: Die Landschaft bleibt unverkennbar alpin, während sich Sprache und kulturelle Atmosphäre verändern. Wer vom Wallis ins Tessin fährt, gelangt in den italienischsprachigen Teil des Landes.",
          "Begegnen Sie diesem Wechsel mit Neugier. Hören Sie auf die Aussprache eines Ortsnamens. Achten Sie auf einen Gruss. Fragen Sie bei Gelegenheit nach einem Gericht auf der Speisekarte. Kleine Begegnungen zeigen die Vielfalt eines Landes, das man von Bildern längst zu kennen glaubt. Der Nufenen gibt dieser Entdeckung eine grossartige Bergkulisse.",
        ],
        closerTitle: "Ein Übergang. Zwei Täler. Ein neuer Klang der Schweiz.",
        closer:
          "Lassen Sie sich bei einem guten Halt nahe der Passhöhe einen Augenblick Stille. Vielleicht denken Sie an den Weg vor sich oder an jemanden, den Sie gerne hierher mitnehmen würden. Vielleicht müssen Sie zum ersten Mal seit Tagen an gar nichts denken. Auch diese Freiheit gehört zum Wert einer Reise. Ein Pass verbindet zwei Orte; manchmal bringt er Sie auch sich selbst wieder näher.",
        captions: [
          "Hochalpine Landschaft rund um den Nufenenpass.",
          "Blick vom Nufenengebiet nach Westen.",
          "Ein Bergsee am Nufenen.",
          "Blick vom Nufenengebiet nach Osten.",
          "Fahnen am Nufenen: ein kleines Detail in weiter Landschaft.",
        ],
      },
    },
  },
};
