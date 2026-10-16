import type {
  Departure,
  Tour,
  TourBooking,
  TourData,
  TourDraft,
  TourParticipants,
} from "./types";

import { firstPaymentAmount, tourTotal } from "./lib/selectors";
import { operationsFixtures } from "./merchant/lib/fixtures";

import { storyFromChapters } from "@/lib/rich-text";

const cancellationPolicy = {
  en: "Sample policy: contact the organiser at least 48 hours before departure. Refunds and rescheduling need merchant approval.",
  de: "Beispielregel: mindestens 48 Stunden vor Beginn den Veranstalter kontaktieren. Rückerstattungen und Umbuchungen brauchen die Zustimmung des Händlers.",
};

export const tourSeed: Tour[] = [
  {
    id: "old-town",
    kind: "tour",
    longStory: storyFromChapters({
      title: {
        en: "The pass where the ice left",
        de: "Der Pass, von dem das Eis gegangen ist",
      },
      chapters: [
        {
          photo: "furka-pass-2",
          title: {
            en: "A glacier you can measure",
            de: "Ein Gletscher, den man messen kann",
          },
          body: {
            en: "In the early 1800s the Rhone Glacier still reached down to Gletsch, the hamlet at the foot of the pass. Because it is so easy to reach, it has been measured since 1879, when it was about 9.1 km long. By 2016 it was 7.65 km, and since 1850 it has lost roughly 60 percent of its volume. Today white blankets cover about two hectares of the ice to slow the melt. From the road you see a pale-green lake where the tongue used to be.",
            de: "Anfang des 19. Jahrhunderts reichte der Rhonegletscher noch bis nach Gletsch hinunter, dem Weiler am Fuss des Passes. Weil er so leicht erreichbar ist, wird er seit 1879 vermessen, damals war er rund 9,1 km lang. 2016 waren es noch 7,65 km, und seit 1850 hat er etwa 60 Prozent seines Volumens verloren. Heute decken weisse Vliese rund zwei Hektar Eis ab, um die Schmelze zu bremsen. Von der Strasse aus sieht man dort einen blassgrünen See, wo früher die Gletscherzunge lag.",
          },
        },
        {
          photo: "furka-pass-3",
          title: {
            en: "A road, a hotel, a view that moved away",
            de: "Eine Strasse, ein Hotel, eine Aussicht, die davonzog",
          },
          body: {
            en: "The carriage road over the Furka was built between 1864 and 1866, and the federal government paid two thirds of it for military reasons. In 1882 Josef Seiler put a lodge into one of its hairpins, the beginning of the Hotel Belvédère. It grew into a Belle Époque landmark with the glacier a few hundred metres away. Since then the ice has pulled back by more than a kilometre, and the hotel has been closed since 2015. You come here to look, not to sleep.",
            de: "Die Kutschenstrasse über die Furka entstand 1864 bis 1866, zwei Drittel der Kosten übernahm aus militärischen Gründen der Bund. 1882 baute Josef Seiler in eine Kehre eine Herberge, der Anfang des Hotels Belvédère. Es wurde zum Wahrzeichen der Belle Époque, der Gletscher lag nur einige hundert Meter entfernt. Seither ist das Eis um mehr als einen Kilometer zurückgewichen, und das Hotel ist seit 2015 geschlossen. Man kommt hierher zum Schauen, nicht zum Übernachten.",
          },
        },
        {
          photo: "furka-pass-1",
          title: {
            en: "Bond, bends and thin air",
            de: "Bond, Kehren und dünne Luft",
          },
          body: {
            en: "In 1964 the crew of Goldfinger came to the Furka: the sniper scene with Tilly Masterson was shot on the pass, the car chase on the curving roads near Realp. One bend is now signed as a James Bond Strasse, with a lookout. For riders the pass is a steady string of hairpins and sweepers, with gradients of up to about 10 to 11 percent. At 2,429 m a sunny valley morning can turn cold and windy at the top, so dress for the summit, not for Realp.",
            de: "1964 kam das Team von Goldfinger auf die Furka: Die Szene mit Tilly Masterson als Scharfschützin wurde auf dem Pass gedreht, die Verfolgungsjagd auf den kurvigen Strassen bei Realp. Eine Kurve ist heute als «James Bond Strasse» beschildert, mit Aussichtspunkt. Für Motorradfahrer ist der Pass eine stetige Folge von Kehren und weiten Bögen mit Steigungen von bis zu rund 10 bis 11 Prozent. Auf 2429 m kann aus einem sonnigen Talmorgen oben ein kalter, windiger Tag werden, also kleide dich für den Gipfel, nicht für Realp.",
          },
        },
      ],
    }),
    slug: "furka-pass",
    name: {
      en: "Furka Pass by motorbike",
      de: "Furkapass mit dem Motorrad",
    },
    summary: {
      en: "Hairpins above a glacier that is walking away",
      de: "Kehren über einem Gletscher, der sich zurückzieht",
    },
    description: {
      en: "A 2,429 m crossing from the Urseren valley in Uri to the Goms in Valais, with the Rhone Glacier right beside the road. It is the pass of 1960s film glamour, old grand hotels and a glacier you can watch shrinking.",
      de: "Eine Überfahrt auf 2429 m vom Urserntal im Kanton Uri ins Goms im Wallis, mit dem Rhonegletscher direkt neben der Strasse. Der Pass der Filmkulisse der 1960er, der alten Grandhotels und eines Gletschers, dem man beim Schrumpfen zusehen kann.",
    },
    photos: [
      "furka-pass-1",
      "furka-pass-2",
      "furka-pass-3",
      "furka-pass-4",
      "furka-pass-5",
      "furka-pass-6",
    ],
    durationMinutes: 1890,
    adultPrice: 24000,
    childPrice: 12000,
    infantPrice: 0,
    meetingPoint: {
      en: "Confirmed with Erich after booking",
      de: "Wird nach der Buchung mit Erich bestätigt",
    },
    included: [
      {
        en: "Guided ride over the Furka Pass with a local host",
        de: "Geführte Fahrt über den Furkapass mit einem lokalen Gastgeber",
      },
      {
        en: "Planned stops with the story behind each place",
        de: "Geplante Stopps mit der Geschichte hinter jedem Ort",
      },
    ],
    excluded: {
      en: "Fuel, meals and accommodation. Motorcycle and riding gear are arranged separately: ask before booking.",
      de: "Treibstoff, Essen und Unterkunft. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
    },
    conditions: {
      en: "A valid motorcycle licence is required; riders from 18. The pass is usually open from about June to October, and snow or weather can change or cancel a day. Check the road status before riding.",
      de: "Ein gültiger Motorradführerschein ist nötig; Fahrer ab 18 Jahren. Der Pass ist meist von etwa Juni bis Oktober offen, Schnee oder Wetter können einen Tag verändern oder absagen. Vor der Fahrt den Strassenzustand prüfen.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [
      {
        id: "realp",
        name: {
          en: "Realp",
          de: "Realp",
        },
        description: {
          en: "The last village of the Urseren valley in Uri, at about 1,540 m, where the climb to the Furka begins. The Goldfinger car chase was filmed on the curving roads nearby.",
          de: "Das letzte Dorf im Urserntal im Kanton Uri auf rund 1540 m, wo der Aufstieg zur Furka beginnt. Die Verfolgungsjagd aus Goldfinger wurde auf den kurvigen Strassen in der Nähe gedreht.",
        },
        minutesFromStart: 0,
        coordinates: [8.5021, 46.5988],
        photo: "furka-pass-4",
        note: {
          en: "The Furka steam railway (Dampfbahn Furka-Bergstrecke) starts here, on the old mountain line.",
          de: "Hier beginnt die Dampfbahn Furka-Bergstrecke auf der alten Bergstrecke.",
        },
      },
      {
        id: "furka-summit",
        name: {
          en: "Furka summit",
          de: "Furka-Passhöhe",
        },
        description: {
          en: "The border between Uri and Valais at 2,429 m, and the European watershed between the Reuss (Rhine, North Sea) and the Rhone (Mediterranean).",
          de: "Die Grenze zwischen Uri und Wallis auf 2429 m und die europäische Wasserscheide zwischen Reuss (Rhein, Nordsee) und Rhone (Mittelmeer).",
        },
        minutesFromStart: 110,
        coordinates: [8.415, 46.5725],
        photo: "furka-pass-5",
        note: {
          en: "The sign at the top still reads 2,436 m, the old map value; the current official height is 2,429 m.",
          de: "Das Schild oben nennt noch 2436 m, den Wert der alten Siegfriedkarte; die aktuelle amtliche Höhe beträgt 2429 m.",
        },
      },
      {
        id: "belvedere",
        name: {
          en: "Hotel Belvédère and Rhone Glacier",
          de: "Hotel Belvédère und Rhonegletscher",
        },
        description: {
          en: "The 1882 hotel sits in a hairpin at about 2,270 m, facing the Rhone Glacier. It has been closed since 2015, but the building and the view are still worth a stop.",
          de: "Das Hotel von 1882 steht in einer Kehre auf rund 2270 m, mit Blick auf den Rhonegletscher. Es ist seit 2015 geschlossen, doch Gebäude und Aussicht sind weiterhin einen Halt wert.",
        },
        minutesFromStart: 190,
        coordinates: [8.3884, 46.57668],
        photo: "furka-pass-3",
        note: {
          en: "Park only in the marked areas; the road here is narrow and busy in summer.",
          de: "Nur auf den markierten Plätzen parkieren; die Strasse ist hier schmal und im Sommer stark befahren.",
        },
      },
      {
        id: "gletsch",
        name: {
          en: "Gletsch",
          de: "Gletsch",
        },
        description: {
          en: "A hamlet at 1,757 m where the Furka and Grimsel roads meet, once right next to the glacier's mouth. Furka steam trains stop at its station.",
          de: "Ein Weiler auf 1757 m, wo sich Furka- und Grimselstrasse treffen, einst direkt an der Gletscherzunge. Die Dampfzüge der Furka halten an seinem Bahnhof.",
        },
        minutesFromStart: 290,
        coordinates: [8.3615, 46.5622],
        photo: "furka-pass-6",
      },
      {
        id: "oberwald",
        name: {
          en: "Oberwald",
          de: "Oberwald",
        },
        description: {
          en: "The first village of the Goms at 1,377 m, at the head of the upper Rhone valley. A calm place to end the crossing.",
          de: "Das erste Dorf im Goms auf 1377 m, am Anfang des oberen Rhonetals. Ein ruhiger Ort, um die Überfahrt zu beenden.",
        },
        minutesFromStart: 370,
        coordinates: [8.3521, 46.5329],
        photo: "furka-pass-7",
        note: {
          en: "From here a car shuttle runs year-round through the Furka base tunnel to Realp.",
          de: "Von hier verkehrt ganzjährig ein Autoverlad durch den Furka-Basistunnel nach Realp.",
        },
      },
    ],
    ageBands: { childFrom: 12, adultFrom: 18 },
    participantFields: [
      {
        id: "licence",
        label: {
          en: "Motorcycle licence category",
          de: "Führerscheinkategorie",
        },
        required: true,
      },
      {
        id: "bike",
        label: {
          en: "Your motorcycle (make and model)",
          de: "Ihr Motorrad (Marke und Modell)",
        },
        required: false,
      },
    ],
  },
  {
    id: "lake",
    kind: "tour",
    longStory: storyFromChapters({
      title: {
        en: "A trade route that became a power station",
        de: "Eine Handelsroute, die zum Kraftwerk wurde",
      },
      chapters: [
        {
          photo: "grimsel-pass-3",
          title: {
            en: "The mule track",
            de: "Der Saumpfad",
          },
          body: {
            en: "Long before roads, the Grimsel was a mule track. In 1397 Hasli, Goms and Pomat, together with the cities of Interlaken, Thun and Bern, agreed on free and safe trade over it. With the Nufenen and Gries passes it linked the Haslital to Domodossola and the Lombardy plain: cheese and cattle went south, wine, rice, corn and olive oil came north. A hospice on the pass is mentioned in 1400. The trade ended when the Gotthard railway opened in 1882.",
            de: "Lange vor den Strassen war der Grimsel ein Saumpfad. 1397 vereinbarten Hasli, Goms und Pomat gemeinsam mit den Städten Interlaken, Thun und Bern freien und sicheren Handel über den Pass. Zusammen mit Nufenen und Griespass verband er das Haslital mit Domodossola und der Lombardischen Ebene: Käse und Vieh gingen nach Süden, Wein, Reis, Mais und Olivenöl kamen nach Norden. 1400 wird erstmals ein Hospiz auf dem Pass erwähnt. Der Handel endete mit der Eröffnung der Gotthardbahn 1882.",
          },
        },
        {
          photo: "grimsel-pass-1",
          title: {
            en: "Water instead of mules",
            de: "Wasser statt Maultiere",
          },
          body: {
            en: "The track was only paved as a road in 1894. Between the 1920s and the 1950s the Kraftwerke Oberhasli built power stations around the pass, and the road was widened and rerouted around the new lakes. The Grimselsee holds about 100 million cubic metres behind two dam walls finished in 1932, the arch dam Spitallamm (114 m) and the Seeuferegg. Work on a new wall in front of the Spitallamm began in 2019, and the old one stays in the lake.",
            de: "Erst 1894 wurde der Saumpfad zur befestigten Strasse ausgebaut. Zwischen den 1920er- und 1950er-Jahren bauten die Kraftwerke Oberhasli rund um den Pass Kraftwerke, und die Strasse wurde verbreitert und um die neuen Seen herum verlegt. Der Grimselsee fasst hinter zwei 1932 fertiggestellten Staumauern, der Bogenmauer Spitallamm (114 m) und der Seeuferegg, rund 100 Millionen Kubikmeter. 2019 begannen die Arbeiten an einer neuen Mauer vor der Spitallamm, die alte bleibt im See stehen.",
          },
        },
        {
          photo: "grimsel-pass-2",
          title: {
            en: "Hairpins, cold and a hospice",
            de: "Kehren, Kälte und ein Hospiz",
          },
          body: {
            en: "From Handeck the road climbs through hairpins and a tunnel to the Räterichsbodensee, then up to the Grimselsee and the Grimsel Hospiz at 1,980 m, which sits between the two dam walls. The last stretch winds up to the summit and the Totensee. Weather matters: at the Hospiz the mean daily high in July is only about 13 degrees, and it can snow in any month. Pack warm layers and keep a margin on fuel and time.",
            de: "Ab Handeck steigt die Strasse durch Kehren und einen Tunnel zum Räterichsbodensee, dann weiter zum Grimselsee und zum Grimsel Hospiz auf 1980 m, das zwischen den beiden Staumauern liegt. Das letzte Stück windet sich zur Passhöhe und zum Totensee hinauf. Das Wetter spielt eine Rolle: Beim Hospiz liegt das mittlere Tagesmaximum im Juli nur bei etwa 13 Grad, und Schnee ist in jedem Monat möglich. Warme Schichten einpacken und bei Treibstoff und Zeit einen Puffer lassen.",
          },
        },
      ],
    }),
    slug: "grimsel-pass",
    name: {
      en: "Grimsel Pass by motorbike",
      de: "Grimselpass mit dem Motorrad",
    },
    summary: {
      en: "From mule track to hydropower, above the reservoirs",
      de: "Vom Saumpfad zur Wasserkraft, hoch über den Stauseen",
    },
    description: {
      en: "A 2,164 m crossing from the Haslital in the Bernese Oberland to the Goms in Valais. The road passes two reservoirs, the Grimsel Hospiz and the Totensee on its way over an old trade route.",
      de: "Eine Überfahrt auf 2164 m vom Haslital im Berner Oberland ins Goms im Wallis. Die Strasse führt an zwei Stauseen, dem Grimsel Hospiz und dem Totensee vorbei über eine alte Handelsroute.",
    },
    photos: [
      "grimsel-pass-1",
      "grimsel-pass-2",
      "grimsel-pass-3",
      "grimsel-pass-4",
      "grimsel-pass-5",
    ],
    durationMinutes: 1830,
    adultPrice: 22000,
    childPrice: 12000,
    infantPrice: 0,
    meetingPoint: {
      en: "Confirmed with Erich after booking",
      de: "Wird nach der Buchung mit Erich bestätigt",
    },
    included: [
      {
        en: "Guided ride over the Grimsel Pass with a local host",
        de: "Geführte Fahrt über den Grimselpass mit einem lokalen Gastgeber",
      },
      {
        en: "Planned stops with the story behind each place",
        de: "Geplante Stopps mit der Geschichte hinter jedem Ort",
      },
    ],
    excluded: {
      en: "Fuel, meals and accommodation. Motorcycle and riding gear are arranged separately: ask before booking.",
      de: "Treibstoff, Essen und Unterkunft. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
    },
    conditions: {
      en: "A valid motorcycle licence is required; riders from 18. The pass is usually open from about June to October, and snow or weather can change or cancel a day. Check the road status before riding.",
      de: "Ein gültiger Motorradführerschein ist nötig; Fahrer ab 18 Jahren. Der Pass ist meist von etwa Juni bis Oktober offen, Schnee oder Wetter können einen Tag verändern oder absagen. Vor der Fahrt den Strassenzustand prüfen.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [
      {
        id: "handeck",
        photo: "grimsel-pass-2",
        name: {
          en: "Handeck",
          de: "Handeck",
        },
        description: {
          en: "A hamlet at about 1,380 m beyond Guttannen, where the road follows the Aare through short tunnels. It is the lower station of the Gelmerbahn, the steepest funicular in Switzerland.",
          de: "Ein Weiler auf rund 1380 m hinter Guttannen, wo die Strasse der Aare durch kurze Tunnel folgt. Hier liegt die Talstation der Gelmerbahn, der steilsten Standseilbahn der Schweiz.",
        },
        minutesFromStart: 0,
        coordinates: [8.3071, 46.6124],
        note: {
          en: "The ride up from Innertkirchen (625 m, where the Susten road branches off) and Guttannen is the warm-up.",
          de: "Die Fahrt von Innertkirchen (625 m, wo die Sustenstrasse abzweigt) über Guttannen hierher dient zum Einfahren.",
        },
      },
      {
        id: "raeterichsboden",
        name: {
          en: "Räterichsbodensee",
          de: "Räterichsbodensee",
        },
        description: {
          en: "The first reservoir, reached after hairpin bends and a tunnel of about 850 m. A good place to look down on the road you just climbed.",
          de: "Der erste Stausee, erreicht nach Kehren und einem rund 850 m langen Tunnel. Ein guter Ort, um auf die eben gefahrene Strasse hinunterzuschauen.",
        },
        minutesFromStart: 90,
        coordinates: [8.3284, 46.5841],
        photo: "grimsel-pass-1",
      },
      {
        id: "hospiz",
        name: {
          en: "Grimsel Hospiz",
          de: "Grimsel Hospiz",
        },
        description: {
          en: "A stone hotel on a rocky spur between the two dam walls of the Grimselsee, at 1,980 m. A hospice on the pass is documented as early as 1400.",
          de: "Ein steinernes Hotel auf einem Felssporn zwischen den beiden Staumauern des Grimselsees auf 1980 m. Ein Hospiz auf dem Pass ist schon 1400 belegt.",
        },
        minutesFromStart: 170,
        coordinates: [8.3323, 46.5715],
        photo: "grimsel-pass-2",
      },
      {
        id: "grimsel-summit",
        name: {
          en: "Summit and Totensee",
          de: "Passhöhe und Totensee",
        },
        description: {
          en: "The summit lies on the border between Bern and Valais, beside the Totensee at about 2,160 m. This natural lake was raised by 16 m with a dam, and an aqueduct feeds its water to the Grimselsee.",
          de: "Die Passhöhe liegt auf der Grenze zwischen Bern und Wallis, neben dem Totensee auf rund 2160 m. Der natürliche See wurde mit einer Staumauer um 16 m angehoben, und ein Stollen leitet sein Wasser in den Grimselsee.",
        },
        minutesFromStart: 250,
        coordinates: [8.3397, 46.5603],
        photo: "grimsel-pass-3",
        note: {
          en: "The Totensee is also written Totesee on maps. The summit is high and exposed, with cold wind likely.",
          de: "Der Totensee steht auf Karten auch als Totesee. Die Passhöhe ist hoch und exponiert, kalter Wind ist wahrscheinlich.",
        },
      },
      {
        id: "gletsch",
        name: {
          en: "Gletsch",
          de: "Gletsch",
        },
        description: {
          en: "The descent through hairpins ends at Gletsch (about 1,760 m), the crossroads with the Furka road in the upper Rhone valley.",
          de: "Die Abfahrt durch Kehren endet in Gletsch (rund 1760 m), der Kreuzung mit der Furkastrasse im oberen Rhonetal.",
        },
        minutesFromStart: 330,
        coordinates: [8.3615, 46.5622],
        photo: "grimsel-pass-5",
      },
    ],
    ageBands: { childFrom: 12, adultFrom: 18 },
    participantFields: [
      {
        id: "licence",
        label: {
          en: "Motorcycle licence category",
          de: "Führerscheinkategorie",
        },
        required: true,
      },
      {
        id: "bike",
        label: {
          en: "Your motorcycle (make and model)",
          de: "Ihr Motorrad (Marke und Modell)",
        },
        required: false,
      },
    ],
  },
  {
    id: "night",
    kind: "tour",
    longStory: storyFromChapters({
      title: {
        en: "A road that was drawn, not just built",
        de: "Eine Strasse, die gezeichnet wurde",
      },
      chapters: [
        {
          photo: "susten-pass-2",
          title: {
            en: "Late, and on purpose",
            de: "Spät, und mit Absicht",
          },
          body: {
            en: "People first tried to turn the old mule track into a carriage road after 1811, but the work stalled and Bern stopped in 1823. Only the federal Alpine roads decree of 1935 made it possible: tourism, jobs in the mountains and defence all pulled the same way. The road was built from 1939 to 1946. Because it came so late, it has long sweeping bends rather than the tight switchbacks of older passes.",
            de: "Schon nach 1811 wollte man den alten Saumpfad zur Fahrstrasse ausbauen, doch die Arbeiten gerieten ins Stocken, und Bern stellte den Bau 1823 ein. Erst der Bundesbeschluss über die Alpenstrassen von 1935 machte es möglich: Tourismus, Arbeit im Berggebiet und Landesverteidigung zogen am selben Strang. Gebaut wurde von 1939 bis 1946. Weil sie so spät entstand, hat die Strasse weite Schwünge statt der engen Kehren älterer Pässe.",
          },
        },
        {
          photo: "susten-pass-3",
          title: {
            en: "Handwork you can still read",
            de: "Handwerk, das man noch lesen kann",
          },
          body: {
            en: "The Historical Dictionary of Switzerland describes the building as an aesthetic programme: as much hand labour as possible, local materials and granite facing, so the road would have the character of a crafted object. You see it from the saddle: stone-faced walls, granite posts, bridges and tunnels placed like strokes in one drawing. On a motorbike it feels like a line you follow, and one that someone has to look after every year.",
            de: "Das Historische Lexikon der Schweiz beschreibt den Bau als ästhetisches Programm: möglichst viel Handarbeit, lokale Materialien und Granitverkleidung, damit die Strasse kunsthandwerklichen Charakter erhält. Vom Sattel aus sieht man es: verkleidete Mauern, Granitpfosten, Brücken und Tunnel, gesetzt wie Striche in einer einzigen Zeichnung. Auf dem Motorrad fühlt sie sich an wie eine Linie, der man folgt, und um die sich jedes Jahr jemand kümmern muss.",
          },
        },
        {
          photo: "susten-pass-4",
          title: {
            en: "The Stein Glacier and its lake",
            de: "Der Steingletscher und sein See",
          },
          body: {
            en: "On the Bernese side the Stein Glacier hangs above the road. Around the middle of the 19th century it was about a kilometre longer than today, and its tongue now ends near 2,000 m. The little Steinsee at 1,934 m only appeared after 1940, on the ground the ice gave up. The glacier advanced again in 1912–1921 and 1969–1981, then melted strongly. The road and the lake are almost the same age.",
            de: "Auf der Berner Seite hängt der Steingletscher über der Strasse. Um die Mitte des 19. Jahrhunderts war er rund einen Kilometer länger als heute, seine Zunge endet jetzt auf etwa 2000 m. Der kleine Steinsee auf 1934 m entstand erst nach 1940, auf dem Boden, den das Eis freigab. Zwischen 1912 und 1921 sowie 1969 und 1981 stiess der Gletscher nochmals vor, seither schmilzt er stark. Strasse und See sind fast gleich alt.",
          },
        },
      ],
    }),
    slug: "susten-pass",
    name: {
      en: "Susten Pass by motorbike",
      de: "Sustenpass mit dem Motorrad",
    },
    summary: {
      en: "A road drawn like a line across the Urner Alps",
      de: "Eine Strasse wie mit dem Lineal durch die Urner Alpen gezogen",
    },
    description: {
      en: "The Susten road climbs from Innertkirchen in the Bernese Oberland to Wassen in Uri, through wide sweeping bends, stone-faced bridges and a summit tunnel at 2,224 m, past the retreating Stein Glacier.",
      de: "Die Sustenstrasse führt von Innertkirchen im Berner Oberland nach Wassen im Kanton Uri: in weiten Schwüngen, über steinverkleidete Brücken und durch den Scheiteltunnel auf 2224 m, vorbei am zurückweichenden Steingletscher.",
    },
    photos: [
      "susten-pass-1",
      "susten-pass-2",
      "susten-pass-3",
      "susten-pass-4",
      "susten-pass-5",
      "susten-pass-6",
    ],
    durationMinutes: 3270,
    adultPrice: 22000,
    childPrice: 12000,
    infantPrice: 0,
    meetingPoint: {
      en: "Confirmed with Erich after booking",
      de: "Wird nach der Buchung mit Erich bestätigt",
    },
    included: [
      {
        en: "Guided ride over the Susten Pass with a local host",
        de: "Geführte Fahrt über den Sustenpass mit einem lokalen Gastgeber",
      },
      {
        en: "Planned stops with the story behind each place",
        de: "Geplante Stopps mit der Geschichte hinter jedem Ort",
      },
    ],
    excluded: {
      en: "Fuel, meals and accommodation. Motorcycle and riding gear are arranged separately: ask before booking.",
      de: "Treibstoff, Essen und Unterkunft. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
    },
    conditions: {
      en: "A valid motorcycle licence is required; riders from 18. The pass is usually open from about June to October, and snow or weather can change or cancel a day. Check the road status before riding.",
      de: "Ein gültiger Motorradführerschein ist nötig; Fahrer ab 18 Jahren. Der Pass ist meist von etwa Juni bis Oktober offen, Schnee oder Wetter können einen Tag verändern oder absagen. Vor der Fahrt den Strassenzustand prüfen.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [
      {
        id: "innertkirchen",
        name: {
          en: "Innertkirchen",
          de: "Innertkirchen",
        },
        description: {
          en: "The start of the ride in the Haslital, where the Aare valley opens and the Susten road branches off towards the Gadmer valley.",
          de: "Startpunkt im Haslital, wo sich das Aaretal öffnet und die Sustenstrasse ins Gadmertal abzweigt.",
        },
        minutesFromStart: 0,
        coordinates: [8.2286, 46.7054],
        photo: "susten-pass-7",
      },
      {
        id: "gadmen",
        name: {
          en: "Gadmen",
          de: "Gadmen",
        },
        description: {
          en: "A quiet village in the Gadmer valley with the road running straight through its centre, a good moment to settle in before the climb gets serious.",
          de: "Ein ruhiges Dorf im Gadmertal, die Strasse führt mitten durch. Ein guter Moment, bevor der Aufstieg ernst wird.",
        },
        minutesFromStart: 75,
        coordinates: [8.3527, 46.7381],
        photo: "susten-pass-5",
      },
      {
        id: "steingletscher",
        name: {
          en: "Steingletscher",
          de: "Steingletscher",
        },
        description: {
          en: "The stop below the Stein Glacier and the Steinsee, the best place to look at what the retreating ice left behind.",
          de: "Der Halt unterhalb von Steingletscher und Steinsee, der beste Ort, um zu sehen, was das zurückweichende Eis hinterlassen hat.",
        },
        minutesFromStart: 160,
        coordinates: [8.433, 46.7125],
        photo: "susten-pass-4",
        note: {
          en: "It is noticeably cooler here than in the valley; keep a warm layer within reach.",
          de: "Hier ist es spürbar kühler als im Tal; eine warme Schicht griffbereit halten.",
        },
      },
      {
        id: "summit",
        name: {
          en: "Summit tunnel (2,224 m)",
          de: "Scheiteltunnel (2224 m)",
        },
        description: {
          en: "The road crosses the watershed in a tunnel of roughly 300 metres at 2,224 m, the highest point of the road itself.",
          de: "Die Strasse quert die Wasserscheide in einem rund 300 Meter langen Tunnel auf 2224 m, dem höchsten Punkt der Strasse selbst.",
        },
        minutesFromStart: 215,
        coordinates: [8.449, 46.73],
        photo: "susten-pass-8",
        note: {
          en: "Expect cold air and wet tarmac at the tunnel mouths even on a sunny day.",
          de: "An den Tunnelportalen ist auch an sonnigen Tagen mit kalter Luft und nassem Belag zu rechnen.",
        },
      },
      {
        id: "wassen",
        name: {
          en: "Wassen",
          de: "Wassen",
        },
        description: {
          en: "The Uri end of the pass, where the Susten road meets the Gotthard axis. The village is known for its church above the Reuss valley.",
          de: "Das Urner Ende des Passes, wo die Sustenstrasse auf die Gotthardachse trifft. Das Dorf ist bekannt für seine Kirche über dem Reusstal.",
        },
        minutesFromStart: 310,
        coordinates: [8.5996, 46.7068],
        photo: "susten-pass-6",
      },
    ],
    ageBands: { childFrom: 12, adultFrom: 18 },
    participantFields: [
      {
        id: "licence",
        label: {
          en: "Motorcycle licence category",
          de: "Führerscheinkategorie",
        },
        required: true,
      },
      {
        id: "bike",
        label: {
          en: "Your motorcycle (make and model)",
          de: "Ihr Motorrad (Marke und Modell)",
        },
        required: false,
      },
    ],
  },
  {
    id: "workshop",
    kind: "tour",
    longStory: storyFromChapters({
      title: {
        en: "The king of mountain passes",
        de: "Der König der Pässe",
      },
      chapters: [
        {
          photo: "gotthard-pass-2",
          title: {
            en: "A bridge over the gorge",
            de: "Eine Brücke über die Schlucht",
          },
          body: {
            en: "For a long time the Reuss in the narrow Schöllenen gorge blocked the way. Around 1220 the first wooden bridge opened the pass, and its importance grew quickly; The opening of the gorge was an important factor in the rise of the early Swiss Confederacy. The Devil's Bridge legend is much younger than the bridge: it is first written down in the early 18th century. The current concrete span from the 1950s stands above the stone bridge of 1830.",
            de: "Lange versperrte die Reuss in der engen Schöllenenschlucht den Weg. Um 1220 öffnete die erste Holzbrücke den Pass, und seine Bedeutung wuchs rasch; Die Öffnung der Schlucht war ein wichtiger Faktor bei der Entstehung der frühen Eidgenossenschaft. Die Teufelsbrücken-Sage ist viel jünger als die Brücke: Aufgeschrieben wurde sie erst im frühen 18. Jahrhundert. Die heutige Betonbrücke aus den 1950er-Jahren steht über der Steinbrücke von 1830.",
          },
        },
        {
          photo: "gotthard-pass-3",
          title: {
            en: "Twenty-four bends of granite",
            de: "Vierundzwanzig Kehren aus Granit",
          },
          body: {
            en: "The Tremola is the old road from the hospice down to Airolo, built between 1827 and 1832 as part of the widening of the Basel–Chiasso route. On its steepest four kilometres it gains about 300 metres in 24 hairpin bends. It is listed in the federal inventory of historic Swiss roads, and its supporting walls and much of the granite paving are still there. On a bike you ride over cobbles that carried the stagecoach.",
            de: "Die Tremola ist die alte Strasse vom Hospiz hinunter nach Airolo, gebaut zwischen 1827 und 1832 im Zuge des Ausbaus der Route Basel–Chiasso. Auf den steilsten vier Kilometern gewinnt sie rund 300 Höhenmeter in 24 Kehren. Sie steht im Bundesinventar der historischen Verkehrswege der Schweiz, die Stützmauern und ein grosser Teil des Granitpflasters sind erhalten. Auf dem Motorrad fährt man über Pflaster, das schon die Postkutsche getragen hat.",
          },
        },
        {
          photo: "gotthard-pass-4",
          title: {
            en: "Over the top, and under it",
            de: "Obendrüber und untendurch",
          },
          body: {
            en: "At the summit, lakes, the hospice and a museum sit at about 2,100 metres. Beneath you three tunnels have each been the longest of their kind: the 15 km rail tunnel of 1882, the 17 km road tunnel of 1980 and the 57 km Gotthard Base Tunnel of 2016. Since the road tunnel opened, the pass itself carries little through traffic, which is part of why riding it today feels like a choice rather than a necessity.",
            de: "Auf der Passhöhe liegen auf etwa 2100 Metern mehrere Seen, das Hospiz und ein Museum. Unter dir waren drei Tunnel jeweils die längsten ihrer Art: der 15 km lange Eisenbahntunnel von 1882, der 17 km lange Strassentunnel von 1980 und der 57 km lange Gotthard-Basistunnel von 2016. Seit der Strassentunnel offen ist, trägt der Pass kaum noch Durchgangsverkehr, weshalb sich die Fahrt heute wie eine Wahl anfühlt und nicht wie eine Notwendigkeit.",
          },
        },
      ],
    }),
    slug: "gotthard-pass",
    name: {
      en: "Gotthard Pass by motorbike",
      de: "Gotthardpass mit dem Motorrad",
    },
    summary: {
      en: "The road that held a country together",
      de: "Die Strasse, die ein Land zusammenhielt",
    },
    description: {
      en: "From the Schöllenen gorge and the Devil's Bridge over Andermatt to the hospice at 2,106 m, then down the granite-cobbled hairpins of the Tremola into Airolo: the old crossing between north and south.",
      de: "Von der Schöllenenschlucht und der Teufelsbrücke über Andermatt zum Hospiz auf 2106 m und dann über die granitgepflasterten Kehren der Tremola nach Airolo: der alte Übergang zwischen Nord und Süd.",
    },
    photos: [
      "gotthard-pass-1",
      "gotthard-pass-2",
      "gotthard-pass-3",
      "gotthard-pass-4",
      "gotthard-pass-5",
      "gotthard-pass-6",
    ],
    durationMinutes: 3270,
    adultPrice: 24000,
    childPrice: 12000,
    infantPrice: 0,
    meetingPoint: {
      en: "Confirmed with Erich after booking",
      de: "Wird nach der Buchung mit Erich bestätigt",
    },
    included: [
      {
        en: "Guided ride over the Gotthard Pass with a local host",
        de: "Geführte Fahrt über den Gotthardpass mit einem lokalen Gastgeber",
      },
      {
        en: "Planned stops with the story behind each place",
        de: "Geplante Stopps mit der Geschichte hinter jedem Ort",
      },
    ],
    excluded: {
      en: "Fuel, meals and accommodation. Motorcycle and riding gear are arranged separately: ask before booking.",
      de: "Treibstoff, Essen und Unterkunft. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
    },
    conditions: {
      en: "A valid motorcycle licence is required; riders from 18. The pass is usually open from about June to October, and snow or weather can change or cancel a day. Check the road status before riding.",
      de: "Ein gültiger Motorradführerschein ist nötig; Fahrer ab 18 Jahren. Der Pass ist meist von etwa Juni bis Oktober offen, Schnee oder Wetter können einen Tag verändern oder absagen. Vor der Fahrt den Strassenzustand prüfen.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [
      {
        id: "schoellenen",
        name: {
          en: "Schöllenen gorge and Devil's Bridge",
          de: "Schöllenenschlucht und Teufelsbrücke",
        },
        description: {
          en: "The narrow gorge of the Reuss above Göschenen, where the road, an old stone bridge and the modern bridge hang over each other.",
          de: "Die enge Reussschlucht oberhalb von Göschenen, wo Strasse, alte Steinbrücke und moderne Brücke übereinander hängen.",
        },
        minutesFromStart: 0,
        coordinates: [8.5903, 46.6474],
        photo: "gotthard-pass-6",
        note: {
          en: "Narrow, busy road with tight bends; take it slowly and look at the bridges from the parking area.",
          de: "Enge, belebte Strasse mit engen Kurven; langsam fahren und die Brücken vom Parkplatz aus ansehen.",
        },
      },
      {
        id: "andermatt",
        name: {
          en: "Andermatt",
          de: "Andermatt",
        },
        description: {
          en: "The village in the Urseren valley at the foot of the Gotthard, Furka and Oberalp routes, a natural place for a break before the climb.",
          de: "Das Dorf im Urserental am Fuss von Gotthard-, Furka- und Oberalproute, ein natürlicher Ort für eine Pause vor dem Aufstieg.",
        },
        minutesFromStart: 55,
        coordinates: [8.5948, 46.634],
        photo: "gotthard-pass-5",
      },
      {
        id: "hospice",
        name: {
          en: "Hospice and summit lakes (2,106 m)",
          de: "Hospiz und Passseen (2106 m)",
        },
        description: {
          en: "The summit area with the small lakes, the old hospice and the museum. The official summit sits in Ticino, a couple of kilometres south of the border with Uri.",
          de: "Das Gipfelareal mit den kleinen Seen, dem alten Hospiz und dem Museum. Der offizielle Scheitelpunkt liegt im Tessin, einige Kilometer südlich der Grenze zu Uri.",
        },
        minutesFromStart: 160,
        coordinates: [8.5679, 46.5554],
        photo: "gotthard-pass-4",
        note: {
          en: "At this altitude it can be cold and windy even in summer.",
          de: "Auf dieser Höhe kann es selbst im Sommer kalt und windig sein.",
        },
      },
      {
        id: "tremola",
        name: {
          en: "Tremola",
          de: "Tremola",
        },
        description: {
          en: "The old road down the Val Tremola: 24 hairpins and granite cobbles on the southern side.",
          de: "Die alte Strasse durch das Val Tremola: 24 Kehren und Granitpflaster auf der Südseite.",
        },
        minutesFromStart: 235,
        coordinates: [8.5815, 46.5435],
        photo: "gotthard-pass-3",
        note: {
          en: "Cobbles are slippery when wet, and the hairpins are tight; stay in a low gear and ride deliberately.",
          de: "Das Pflaster ist nass rutschig, die Kehren sind eng; im kleinen Gang und überlegt fahren.",
        },
      },
      {
        id: "airolo",
        name: {
          en: "Airolo",
          de: "Airolo",
        },
        description: {
          en: "The first town in Ticino on the southern foot of the Gotthard, at the head of the Leventina valley.",
          de: "Der erste Ort im Tessin am Südfuss des Gotthards, am Anfang der Leventina.",
        },
        minutesFromStart: 320,
        coordinates: [8.6086, 46.529],
        photo: "gotthard-pass-7",
      },
    ],
    ageBands: { childFrom: 12, adultFrom: 18 },
    participantFields: [
      {
        id: "licence",
        label: {
          en: "Motorcycle licence category",
          de: "Führerscheinkategorie",
        },
        required: true,
      },
      {
        id: "bike",
        label: {
          en: "Your motorcycle (make and model)",
          de: "Ihr Motorrad (Marke und Modell)",
        },
        required: false,
      },
    ],
  },
  {
    id: "pilatus",
    kind: "tour",
    longStory: storyFromChapters({
      title: {
        en: "Up where the road finally arrived",
        de: "Hinauf, wo die Strasse endlich ankam",
      },
      chapters: [
        {
          photo: "nufenen-pass-1",
          title: {
            en: "The highest wholly in Switzerland",
            de: "Die höchste, ganz in der Schweiz",
          },
          body: {
            en: "The Nufenen road was built from the mid-1960s and opened on 5 September 1969. At 2,478 m it is the highest pass road lying completely within Switzerland. The Umbrail road is higher, at 2,501 m, but it crosses into Italy just below its summit. Until the road was built, the Nufenen was only a footpath.",
            de: "Die Nufenenstrasse wurde ab Mitte der 1960er-Jahre gebaut und am 5. September 1969 eröffnet. Mit 2478 m ist sie die höchstgelegene Passstrasse, die vollständig in der Schweiz liegt. Die Umbrailstrasse ist mit 2501 m höher, überschreitet aber knapp unterhalb ihrer Passhöhe die Grenze nach Italien. Bis zum Bau der Strasse war der Nufenen nur ein Fussweg.",
          },
        },
        {
          photo: "nufenen-pass-2",
          title: {
            en: "Glacier, Gries and an older way over",
            de: "Gletscher, Gries und ein älterer Weg",
          },
          body: {
            en: "From the top you look south-west to the Gries Glacier and north to the Bernese Alps with the Finsteraarhorn. The old trade way did not use this saddle. It ran over the nearby Gries Pass at 2,487 m, a mule path from Ulrichen to the Formazza valley, known since the Bronze Age and developed as a trading route from 1397. Walser settlers also used it in the 13th century. The railway killed that trade in 1882; the road came almost ninety years later.",
            de: "Von der Passhöhe blickt man nach Südwesten zum Griesgletscher und nach Norden zu den Berner Alpen mit dem Finsteraarhorn. Der alte Handelsweg benutzte diesen Sattel nicht. Er führte über den nahen Griespass auf 2487 m, einen Saumpfad von Ulrichen ins Val Formazza, seit der Bronzezeit bekannt und ab 1397 als Handelsweg ausgebaut. Auch Walser Siedler zogen im 13. Jahrhundert darüber. Die Eisenbahn beendete 1882 diesen Handel; die Strasse kam fast neunzig Jahre später.",
          },
        },
        {
          photo: "nufenen-pass-3",
          title: {
            en: "Down the Val Bedretto",
            de: "Hinunter durchs Bedrettotal",
          },
          body: {
            en: "The Ticino river rises just east of the summit, and the road crosses it seven times on the way down. The Ticino side is longer and gentler than the Valais side: about 24 km at an average gradient of 5.4 percent, against 13 km at 8.6 percent on the Ulrichen side, with maximum gradients of 10 and 13 percent. The true low point between the valleys lies 500 m south of the road, at 2,439 m, but it is hard to reach from the west, so the road runs higher on the northern flank.",
            de: "Der Tessin entspringt östlich der Passhöhe, und die Strasse überquert ihn auf dem Weg nach unten siebenmal. Die Tessiner Seite ist länger und sanfter als die Walliser: rund 24 km bei durchschnittlich 5,4 Prozent Steigung, gegenüber 13 km mit 8,6 Prozent auf der Seite von Ulrichen, mit maximalen Steigungen von 10 und 13 Prozent. Der tiefste Punkt zwischen den Tälern liegt 500 m südlich der Strasse auf 2439 m, ist von Westen aber schwer zu erreichen, weshalb die Strasse höher an der nördlichen Talflanke verläuft.",
          },
        },
      ],
    }),
    slug: "nufenen-pass",
    name: {
      en: "Nufenen Pass by motorbike",
      de: "Nufenenpass mit dem Motorrad",
    },
    summary: {
      en: "The highest pass road entirely in Switzerland",
      de: "Die höchste Passstrasse, die ganz in der Schweiz liegt",
    },
    description: {
      en: "At 2,478 m the Nufenen road links Ulrichen in the Goms (Valais) with the Val Bedretto and Airolo (Ticino), past the Gries Glacier and the source of the Ticino river.",
      de: "Auf 2478 m verbindet die Nufenenstrasse Ulrichen im Goms (Wallis) mit dem Bedrettotal und Airolo (Tessin), vorbei am Griesgletscher und an der Quelle des Tessins.",
    },
    photos: [
      "nufenen-pass-1",
      "nufenen-pass-2",
      "nufenen-pass-3",
      "nufenen-pass-4",
      "nufenen-pass-5",
      "nufenen-pass-6",
    ],
    durationMinutes: 1830,
    adultPrice: 26000,
    childPrice: 12000,
    infantPrice: 0,
    meetingPoint: {
      en: "Confirmed with Erich after booking",
      de: "Wird nach der Buchung mit Erich bestätigt",
    },
    included: [
      {
        en: "Guided ride over the Nufenen Pass with a local host",
        de: "Geführte Fahrt über den Nufenenpass mit einem lokalen Gastgeber",
      },
      {
        en: "Planned stops with the story behind each place",
        de: "Geplante Stopps mit der Geschichte hinter jedem Ort",
      },
    ],
    excluded: {
      en: "Fuel, meals and accommodation. Motorcycle and riding gear are arranged separately: ask before booking.",
      de: "Treibstoff, Essen und Unterkunft. Motorrad und Fahrerausrüstung werden separat geklärt: bitte vor der Buchung fragen.",
    },
    conditions: {
      en: "A valid motorcycle licence is required; riders from 18. The pass is usually open from about June to October, and snow or weather can change or cancel a day. Check the road status before riding.",
      de: "Ein gültiger Motorradführerschein ist nötig; Fahrer ab 18 Jahren. Der Pass ist meist von etwa Juni bis Oktober offen, Schnee oder Wetter können einen Tag verändern oder absagen. Vor der Fahrt den Strassenzustand prüfen.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [
      {
        id: "ulrichen",
        name: {
          en: "Ulrichen",
          de: "Ulrichen",
        },
        description: {
          en: "The upper Goms village in the Rhône valley where the Nufenen road branches off and starts to climb.",
          de: "Das Dorf im Obergoms im Rhonetal, wo die Nufenenstrasse abzweigt und zu steigen beginnt.",
        },
        minutesFromStart: 0,
        coordinates: [8.305, 46.5066],
        photo: "nufenen-pass-5",
      },
      {
        id: "summit",
        name: {
          en: "Nufenen summit (2,478 m)",
          de: "Nufenen-Passhöhe (2478 m)",
        },
        description: {
          en: "The cantonal border between Valais and Ticino, with a restaurant, a small lake and views to the Bernese Alps and the Gries Glacier.",
          de: "Die Kantonsgrenze zwischen Wallis und Tessin, mit Restaurant, kleinem See und Aussicht auf die Berner Alpen und den Griesgletscher.",
        },
        minutesFromStart: 110,
        coordinates: [8.3931, 46.4781],
        photo: "nufenen-pass-1",
        note: {
          en: "At nearly 2,500 m it is often cold, windy and cloudy, even in summer; carry a warm layer.",
          de: "Auf fast 2500 m ist es oft kalt, windig und neblig, auch im Sommer; eine warme Schicht mitnehmen.",
        },
      },
      {
        id: "allacqua",
        name: {
          en: "All'Acqua",
          de: "All'Acqua",
        },
        description: {
          en: "The first hamlet on the Ticino side, at the head of the Val Bedretto, just below the descent from the pass.",
          de: "Der erste Weiler auf der Tessiner Seite am Beginn des Bedrettotals, gleich unterhalb der Passabfahrt.",
        },
        minutesFromStart: 185,
        coordinates: [8.4757, 46.4869],
        photo: "nufenen-pass-7",
      },
      {
        id: "bedretto",
        name: {
          en: "Val Bedretto (Ossasco)",
          de: "Bedrettotal (Ossasco)",
        },
        description: {
          en: "A long green valley of stone houses and meadows, with the young Ticino river beside the road.",
          de: "Ein langes grünes Tal mit Steinhäusern und Wiesen, der junge Tessin fliesst neben der Strasse.",
        },
        minutesFromStart: 250,
        coordinates: [8.5389, 46.5127],
        photo: "nufenen-pass-6",
      },
      {
        id: "airolo",
        photo: "nufenen-pass-6",
        name: {
          en: "Airolo",
          de: "Airolo",
        },
        description: {
          en: "The end of the Nufenen road in the Leventina valley, at the southern foot of the Gotthard.",
          de: "Das Ende der Nufenenstrasse in der Leventina, am Südfuss des Gotthards.",
        },
        minutesFromStart: 330,
        coordinates: [8.6086, 46.529],
      },
    ],
    ageBands: { childFrom: 12, adultFrom: 18 },
    participantFields: [
      {
        id: "licence",
        label: {
          en: "Motorcycle licence category",
          de: "Führerscheinkategorie",
        },
        required: true,
      },
      {
        id: "bike",
        label: {
          en: "Your motorcycle (make and model)",
          de: "Ihr Motorrad (Marke und Modell)",
        },
        required: false,
      },
    ],
  },
  {
    id: "stay",
    kind: "stay",
    slug: "stay-finsterwald",
    name: {
      en: "Stay at Erich's bee house",
      de: "Zu Gast bei Erichs Bienenhaus",
    },
    summary: {
      en: "A night at Erich's bee house in Finsterwald, Entlebuch",
      de: "Eine Nacht in Erichs Bienenhaus in Finsterwald, Entlebuch",
    },
    description: {
      en: "A homestay kept by Erich Haldi himself, in the UNESCO Biosphere Entlebuch. Check-in is at 15:00; you leave the next morning. Prices and times are demo values, and the rooms are still to be confirmed with Erich.",
      de: "Eine Unterkunft, geführt von Erich Haldi selbst, in der UNESCO Biosphäre Entlebuch. Check-in ist um 15:00 Uhr, am nächsten Morgen reist man ab. Preise und Zeiten sind Demowerte, die Zimmer sind noch mit Erich zu klären.",
    },
    longStory: storyFromChapters({
      title: {
        en: "A house in the Biosphere",
        de: "Ein Haus in der Biosphäre",
      },
      chapters: [
        {
          photo: "finsterwald-1",
          title: {
            en: "A house in the Biosphere",
            de: "Ein Haus in der Biosphäre",
          },
          body: {
            en: "Finsterwald lies in the UNESCO Biosphere Entlebuch. Erich Haldi keeps the house himself and welcomes riders who want to finish a pass day with a quiet night. Rooms and meals are still to be confirmed with him.",
            de: "Finsterwald liegt in der UNESCO Biosphäre Entlebuch. Erich Haldi führt das Haus selbst und empfängt Fahrerinnen und Fahrer, die einen Passtag mit einer ruhigen Nacht beenden wollen. Zimmer und Verpflegung sind noch mit ihm zu klären.",
          },
        },
      ],
    }),
    photos: [
      "finsterwald-1",
      "finsterwald-2",
      "finsterwald-3",
      "finsterwald-4",
    ],
    durationMinutes: 1200,
    adultPrice: 18000,
    childPrice: 9000,
    infantPrice: 0,
    meetingPoint: {
      en: "Finsterwald, Entlebuch. The exact address is sent after booking.",
      de: "Finsterwald, Entlebuch. Die genaue Adresse folgt nach der Buchung.",
    },
    included: [
      {
        en: "One night with Erich Haldi as your host",
        de: "Eine Nacht mit Erich Haldi als Gastgeber",
      },
    ],
    excluded: {
      en: "Meals, drinks and travel. Which extras the stay offers is still to be confirmed with Erich.",
      de: "Essen, Getränke und Anreise. Welche Extras die Unterkunft bietet, ist noch mit Erich zu klären.",
    },
    conditions: {
      en: "Demo prices and times. Check-in from 15:00. Children under the infant age stay free.",
      de: "Demopreise und Demozeiten. Check-in ab 15:00 Uhr. Kleinkinder übernachten gratis.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [],
    ageBands: { childFrom: 6, adultFrom: 16 },
    participantFields: [],
  },
  {
    id: "experience",
    kind: "experience",
    slug: "bee-house-experience",
    name: {
      en: "Erich's Bee House",
      de: "Erichs Bienenhaus",
    },
    summary: {
      en: "A first-season visit to the bee house in Finsterwald, 2027",
      de: "Ein Besuch im Bienenhaus in Finsterwald in der ersten Saison 2027",
    },
    description: {
      en: "The bees are planned for 2027 and nothing at the bee house operates yet. These are first-season dates in spring and summer 2027: a two-hour visit with Erich at the bee house in the UNESCO Biosphere Entlebuch. Prices and times are demo values.",
      de: "Die Bienen sind für 2027 geplant, und im Bienenhaus läuft noch nichts. Das sind Termine der ersten Saison im Frühling und Sommer 2027: ein zweistündiger Besuch mit Erich im Bienenhaus in der UNESCO Biosphäre Entlebuch. Preise und Zeiten sind Demowerte.",
    },
    longStory: storyFromChapters({
      title: { en: "Bees, planned for 2027", de: "Bienen, geplant für 2027" },
      chapters: [
        {
          photo: "finsterwald-6",
          title: {
            en: "Bees, planned for 2027",
            de: "Bienen, geplant für 2027",
          },
          body: {
            en: "Erich plans to keep bees at the house from 2027. Nothing operates yet, so these first-season dates are a preview of a two-hour visit: the hives, the honey and the valley around them.",
            de: "Erich plant ab 2027 Bienen am Haus. Noch läuft nichts, diese Termine der ersten Saison sind deshalb eine Vorschau auf einen zweistündigen Besuch: die Völker, der Honig und das Tal ringsum.",
          },
        },
      ],
    }),
    photos: [
      "finsterwald-6",
      "finsterwald-8",
      "finsterwald-3",
      "finsterwald-5",
    ],
    durationMinutes: 120,
    adultPrice: 6500,
    childPrice: 3500,
    infantPrice: 0,
    meetingPoint: {
      en: "Finsterwald, Entlebuch. Confirmed with Erich after booking.",
      de: "Finsterwald, Entlebuch. Wird nach der Buchung mit Erich bestätigt.",
    },
    included: [
      {
        en: "A two-hour visit at the bee house with Erich",
        de: "Ein zweistündiger Besuch im Bienenhaus mit Erich",
      },
    ],
    excluded: {
      en: "Travel and meals. The programme depends on the first bee season in 2027.",
      de: "Anreise und Essen. Das Programm hängt von der ersten Bienensaison 2027 ab.",
    },
    conditions: {
      en: "First-season dates: the bees are planned for 2027, so the programme and the dates can still change. Demo prices and times.",
      de: "Termine der ersten Saison: Die Bienen sind für 2027 geplant, Programm und Termine können sich noch ändern. Demopreise und Demozeiten.",
    },
    cancellationPolicy,
    published: true,
    itinerary: [],
    ageBands: { childFrom: 6, adultFrom: 16 },
    participantFields: [],
  },
];
export function emptyTourDraft(): TourDraft {
  return {
    tourId: "old-town",
    departureId: "walk-16",
    adults: 2,
    children: 1,
    infants: 0,
    contactName: "",
    phone: "",
    childName: "",
  };
}
type BookingContact = Pick<
  TourBooking,
  "id" | "ref" | "guestId" | "contactName" | "phone"
>;

/**
 * A confirmed sample booking with its first payment made, priced from the tour and departure.
 * A stay may pass several nights, in order.
 */
function seededBooking(
  tour: Tour,
  booked: Departure | Departure[],
  contact: BookingContact,
  group: TourParticipants,
): TourBooking {
  const nights = Array.isArray(booked) ? booked : [booked];
  const departure = nights[0];
  const last = nights[nights.length - 1];
  const total = tourTotal(tour, group, nights.length);
  const firstAmount = firstPaymentAmount(departure.policy, total);
  const createdAt = "2026-10-11T09:00:00+02:00";

  return {
    ...contact,
    ...group,
    language: "en",
    tourId: tour.id,
    departureId: departure.id,
    ...(nights.length > 1 ? { nightIds: nights.map((d) => d.id) } : {}),
    tourName: structuredClone(tour.name),
    meetingPoint: structuredClone(tour.meetingPoint),
    startsAt: departure.startsAt,
    endsAt: new Date(
      Date.parse(last.startsAt) + tour.durationMinutes * 60_000,
    ).toISOString(),
    childName: "",
    total,
    firstAmount,
    adultPrice: tour.adultPrice,
    childPrice: tour.childPrice,
    infantPrice: tour.infantPrice,
    cancellationPolicy: structuredClone(tour.cancellationPolicy),
    policy: departure.policy,
    balanceDueAt: departure.balanceDueAt,
    createdAt,
    activity: [],
    status: "confirmed",
    holdUntil: null,
    payments:
      firstAmount > 0
        ? [
            {
              id: `${contact.id}-payment`,
              amount: firstAmount,
              method: "online",
              status: "succeeded",
              at: createdAt,
            },
          ]
        : [],
  };
}

const zurichHour = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Zurich",
  hour: "2-digit",
  hourCycle: "h23",
});

/** An ISO time with the Zurich offset (CET or CEST) in force on that day. */
function zurichTime(day: string, hour: number, minute = 0): string {
  const [year, month, date] = day.split("-").map(Number);
  const hh = String(hour).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");

  for (const offset of [1, 2]) {
    const instant = Date.UTC(year, month - 1, date, hour - offset, minute);

    if (Number(zurichHour.format(instant)) === hour)
      return `${day}T${hh}:${mm}:00+0${offset}:00`;
  }

  throw new Error(`No Zurich time for ${day} ${hh}:${mm}`);
}
function addDays(day: string, days: number): string {
  return new Date(Date.parse(`${day}T00:00:00Z`) + days * 86_400_000)
    .toISOString()
    .slice(0, 10);
}
/** A deposit departure whose balance is due at 18:00 the day before it starts. */
function listingDeparture(
  id: string,
  tourId: string,
  day: string,
  hour: number,
  capacity: number,
  minute = 0,
): Departure {
  return {
    id,
    tourId,
    startsAt: zurichTime(day, hour, minute),
    capacity,
    policy: "deposit",
    balanceDueAt: zurichTime(addDays(day, -1), 18),
    closed: false,
  };
}
const stayDepartures = Array.from({ length: 16 }, (_, i) => {
  const day = addDays("2026-10-24", i);

  return listingDeparture(`stay-${day}`, "stay", day, 15, 6);
});

/**
 * Visits that start every `step` minutes from `open` and end by `close`, on each day (Zurich
 * wall-clock time): "09:00"–"17:00", 30 minutes, 120 minutes long gives 09:00 to 15:00.
 * Ids read `experience-2027-04-17-0930`.
 */
export function slotDepartures({
  days,
  open,
  close,
  step,
  durationMinutes,
  capacity,
}: {
  days: string[];
  open: string;
  close: string;
  step: number;
  durationMinutes: number;
  capacity: number;
}): Departure[] {
  const minutes = (time: string) => {
    const [h, m] = time.split(":").map(Number);

    return h * 60 + m;
  };
  const starts: number[] = [];

  for (
    let at = minutes(open);
    at + durationMinutes <= minutes(close);
    at += step
  )
    starts.push(at);

  return days.flatMap((day) =>
    starts.map((at) => {
      const hour = Math.floor(at / 60);
      const minute = at % 60;
      const hhmm = `${String(hour).padStart(2, "0")}${String(minute).padStart(2, "0")}`;

      return listingDeparture(
        `experience-${day}-${hhmm}`,
        "experience",
        day,
        hour,
        capacity,
        minute,
      );
    }),
  );
}
// First season: the bees are planned for 2027, so these are the first spring and summer weekends.
const experienceDepartures = slotDepartures({
  days: [
    "2027-04-17",
    "2027-05-15",
    "2027-06-05",
    "2027-06-26",
    "2027-07-24",
    "2027-08-14",
  ].flatMap((saturday) => [saturday, addDays(saturday, 1)]),
  open: "09:00",
  close: "17:00",
  step: 30,
  durationMinutes: 120,
  capacity: 8,
});

export function createTourSeed(): TourData {
  const departures = [
    {
      id: "walk-13",
      tourId: "old-town",
      startsAt: "2026-10-12T08:00:00+02:00",
      capacity: 12,
      policy: "deposit",
      balanceDueAt: "2026-10-11T18:00:00+02:00",
      closed: true,
    },
    {
      id: "walk-16",
      tourId: "old-town",
      startsAt: "2026-10-16T08:00:00+02:00",
      capacity: 12,
      policy: "deposit",
      balanceDueAt: "2026-10-15T18:00:00+02:00",
      closed: false,
    },
    {
      id: "walk-18",
      tourId: "old-town",
      startsAt: "2026-10-18T08:00:00+02:00",
      capacity: 12,
      policy: "full",
      balanceDueAt: "2026-10-18T08:00:00+02:00",
      closed: false,
    },
    {
      id: "walk-20",
      tourId: "old-town",
      startsAt: "2026-10-20T08:00:00+02:00",
      capacity: 12,
      policy: "full",
      balanceDueAt: "2026-10-20T08:00:00+02:00",
      closed: false,
    },
    {
      id: "lake-17",
      tourId: "lake",
      startsAt: "2026-10-17T08:00:00+02:00",
      capacity: 16,
      policy: "later",
      balanceDueAt: "2026-10-16T18:00:00+02:00",
      closed: false,
    },
    // Last seats: 9 of 12 seats are booked, so the sample group of 3 takes the last ones.
    {
      id: "walk-23",
      tourId: "old-town",
      startsAt: "2026-10-23T08:00:00+02:00",
      capacity: 12,
      policy: "deposit",
      balanceDueAt: "2026-10-22T18:00:00+02:00",
      closed: false,
    },
    {
      id: "night-15",
      tourId: "night",
      startsAt: "2026-10-15T08:00:00+02:00",
      capacity: 10,
      policy: "full",
      balanceDueAt: "2026-10-15T08:00:00+02:00",
      closed: false,
    },
    {
      id: "night-22",
      tourId: "night",
      startsAt: "2026-10-22T08:00:00+02:00",
      capacity: 10,
      policy: "full",
      balanceDueAt: "2026-10-22T08:00:00+02:00",
      closed: false,
    },
    {
      id: "nufenen-21",
      tourId: "pilatus",
      startsAt: "2026-10-21T08:00:00+02:00",
      capacity: 8,
      policy: "deposit",
      balanceDueAt: "2026-10-20T18:00:00+02:00",
      closed: false,
    },
    {
      id: "workshop-17",
      tourId: "workshop",
      startsAt: "2026-10-17T08:00:00+02:00",
      capacity: 6,
      policy: "full",
      balanceDueAt: "2026-10-17T08:00:00+02:00",
      closed: false,
    },
  ] satisfies TourData["departures"];
  const tour = tourSeed[0];
  const record = {
    language: "en",
    tourId: tour.id,
    departureId: "walk-13",
    tourName: tour.name,
    meetingPoint: tour.meetingPoint,
    startsAt: "2026-10-12T08:00:00+02:00",
    endsAt: new Date(
      Date.parse("2026-10-12T08:00:00+02:00") + tour.durationMinutes * 60_000,
    ).toISOString(),
    adults: 2,
    children: 1,
    infants: 0,
    childName: "Alex",
    total: tour.adultPrice * 2 + tour.childPrice,
    firstAmount: Math.round((tour.adultPrice * 2 + tour.childPrice) * 0.3),
    adultPrice: tour.adultPrice,
    childPrice: tour.childPrice,
    infantPrice: tour.infantPrice,
    cancellationPolicy: structuredClone(tour.cancellationPolicy),
    policy: "deposit",
    balanceDueAt: "2026-10-11T18:00:00+02:00",
    createdAt: "2026-10-10T10:00:00+02:00",
    activity: [],
  } satisfies Partial<TourBooking>;
  const bookings: TourBooking[] = [
    {
      ...record,
      id: "tour-erich",
      ref: "SK-T1042",
      guestId: "g-erich",
      contactName: "Erich Haldi",
      phone: "+41 79 123 45 67",
      status: "confirmed",
      holdUntil: null,
      payments: [
        {
          id: "tp-1",
          amount: record.firstAmount,
          method: "online",
          status: "succeeded",
          at: record.createdAt,
        },
      ],
    },
    {
      ...record,
      id: "tour-lena",
      ref: "SK-T1044",
      guestId: "g-elena",
      contactName: "Elena Novak",
      phone: "+41 78 555 01 44",
      status: "no_show",
      holdUntil: null,
      payments: [
        {
          id: "tp-2",
          amount: record.total,
          method: "online",
          status: "succeeded",
          at: record.createdAt,
        },
      ],
    },
    {
      ...record,
      id: "tour-marie",
      ref: "SK-T1045",
      guestId: "g-marie",
      contactName: "Marie Dubois",
      phone: "+41 79 555 01 45",
      status: "delivered",
      holdUntil: null,
      payments: [],
    },
    {
      ...record,
      id: "tour-tom",
      ref: "SK-T1043",
      guestId: "g-tom",
      contactName: "Tom Becker",
      phone: "+49 151 555 0143",
      departureId: "walk-16",
      startsAt: "2026-10-16T08:00:00+02:00",
      endsAt: new Date(
        Date.parse("2026-10-16T08:00:00+02:00") + tour.durationMinutes * 60_000,
      ).toISOString(),
      balanceDueAt: "2026-10-15T18:00:00+02:00",
      status: "confirmed",
      holdUntil: null,
      payments: [
        {
          id: "tp-3",
          amount: record.firstAmount,
          method: "online",
          status: "succeeded",
          at: record.createdAt,
        },
      ],
    },
  ];
  // Seat fillers: walk-18 and the workshop are sold out, walk-23 keeps its last 3 seats.
  const fillers = [
    [
      "walk-18",
      {
        id: "tour-yuki",
        ref: "SK-T1046",
        guestId: "g-yuki",
        contactName: "Yuki Tanaka",
        phone: "+41 79 555 01 46",
      },
      { adults: 2, children: 2, infants: 0 },
    ],
    [
      "walk-18",
      {
        id: "tour-sofia",
        ref: "SK-T1047",
        guestId: "g-sofia",
        contactName: "Sofia Rossi",
        phone: "+39 333 555 0147",
      },
      { adults: 4, children: 0, infants: 0 },
    ],
    [
      "walk-18",
      {
        id: "tour-daniel",
        ref: "SK-T1048",
        guestId: "g-daniel",
        contactName: "Daniel Meier",
        phone: "+41 76 555 01 48",
      },
      { adults: 2, children: 2, infants: 1 },
    ],
    [
      "walk-23",
      {
        id: "tour-lars",
        ref: "SK-T1049",
        guestId: "g-lars",
        contactName: "Lars Jensen",
        phone: "+45 20 55 01 49",
      },
      { adults: 3, children: 2, infants: 0 },
    ],
    [
      "walk-23",
      {
        id: "tour-peter",
        ref: "SK-T1050",
        guestId: "g-peter",
        contactName: "Peter Schmid",
        phone: "+41 79 555 01 50",
      },
      { adults: 4, children: 0, infants: 0 },
    ],
    [
      "workshop-17",
      {
        id: "tour-marie-workshop",
        ref: "SK-T1051",
        guestId: "g-marie",
        contactName: "Marie Dubois",
        phone: "+41 79 555 01 45",
      },
      { adults: 2, children: 1, infants: 0 },
    ],
    [
      "workshop-17",
      {
        id: "tour-elena-workshop",
        ref: "SK-T1052",
        guestId: "g-elena",
        contactName: "Elena Novak",
        phone: "+41 78 555 01 44",
      },
      { adults: 3, children: 0, infants: 0 },
    ],
  ] satisfies [string, BookingContact, TourParticipants][];

  for (const [departureId, contact, group] of fillers) {
    const departure = departures.find((d) => d.id === departureId);
    const tour = tourSeed.find((t) => t.id === departure?.tourId);

    if (departure && tour)
      bookings.push(seededBooking(tour, departure, contact, group));
  }
  // Steps 2.10–2.14: overdue policies, completion, cancellation and reconciliation cases.
  const operations = operationsFixtures(tourSeed, departures);
  const listingDepartures = [...stayDepartures, ...experienceDepartures];
  const stay = tourSeed.find((t) => t.id === "stay")!;
  const experience = tourSeed.find((t) => t.id === "experience")!;
  const departureOf = (id: string) =>
    listingDepartures.find((d) => d.id === id)!;
  const stayPaidInFull = seededBooking(
    stay,
    departureOf("stay-2026-11-02"),
    {
      id: "stay-yuki",
      ref: "SK-T1062",
      guestId: "g-yuki",
      contactName: "Yuki Tanaka",
      phone: "+41 79 555 01 46",
    },
    { adults: 2, children: 0, infants: 0 },
  );
  const experienceHold = seededBooking(
    experience,
    departureOf("experience-2027-05-15-1000"),
    {
      id: "experience-daniel",
      ref: "SK-T1064",
      guestId: "g-daniel",
      contactName: "Daniel Meier",
      phone: "+41 76 555 01 48",
    },
    { adults: 2, children: 1, infants: 0 },
  );
  const listingBookings: TourBooking[] = [
    // Three nights, so the stay's range shows on the dashboard and in the account.
    seededBooking(
      stay,
      ["stay-2026-10-30", "stay-2026-10-31", "stay-2026-11-01"].map(
        departureOf,
      ),
      {
        id: "stay-erich",
        ref: "SK-T1061",
        guestId: "g-erich",
        contactName: "Erich Haldi",
        phone: "+41 79 123 45 67",
      },
      { adults: 2, children: 1, infants: 0 },
    ),
    {
      ...stayPaidInFull,
      payments: [
        {
          ...stayPaidInFull.payments[0],
          amount: stayPaidInFull.total,
        },
      ],
    },
    seededBooking(
      experience,
      departureOf("experience-2027-04-17-1400"),
      {
        id: "experience-sofia",
        ref: "SK-T1063",
        guestId: "g-sofia",
        contactName: "Sofia Rossi",
        phone: "+39 333 555 0147",
      },
      { adults: 2, children: 2, infants: 0 },
    ),
    // A sold-out night and a few places gone, so the stay calendar shows both.
    seededBooking(
      stay,
      departureOf("stay-2026-10-28"),
      {
        id: "stay-elena",
        ref: "SK-T1065",
        guestId: "g-elena",
        contactName: "Elena Novak",
        phone: "+41 78 555 01 49",
      },
      { adults: 4, children: 2, infants: 0 },
    ),
    seededBooking(
      stay,
      departureOf("stay-2026-10-25"),
      {
        id: "stay-lars",
        ref: "SK-T1066",
        guestId: "g-lars",
        contactName: "Lars Jensen",
        phone: "+45 20 55 01 50",
      },
      { adults: 2, children: 0, infants: 0 },
    ),
    // A sold-out visit and one with two places left on the first bee house day.
    seededBooking(
      experience,
      departureOf("experience-2027-04-17-0900"),
      {
        id: "experience-marie",
        ref: "SK-T1067",
        guestId: "g-marie",
        contactName: "Marie Dubois",
        phone: "+33 6 55 50 01 51",
      },
      { adults: 6, children: 2, infants: 0 },
    ),
    seededBooking(
      experience,
      departureOf("experience-2027-04-17-1000"),
      {
        id: "experience-peter",
        ref: "SK-T1068",
        guestId: "g-peter",
        contactName: "Peter Schmid",
        phone: "+41 79 555 01 52",
      },
      { adults: 4, children: 2, infants: 0 },
    ),
    {
      ...experienceHold,
      status: "expired",
      holdUntil: null,
      payments: [],
      activity: [
        {
          at: "2026-10-11T09:00:00+02:00",
          event: "created",
          actor: "guest",
        },
        {
          at: "2026-10-11T09:15:00+02:00",
          event: "expired",
          actor: "system",
        },
      ],
    },
  ];

  return {
    tours: structuredClone(tourSeed),
    departures: [...departures, ...operations.departures, ...listingDepartures],
    bookings: [...bookings, ...operations.bookings, ...listingBookings],
    draft: emptyTourDraft(),
  };
}
