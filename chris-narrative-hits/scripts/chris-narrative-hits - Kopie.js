// Funktion zur Erstellung einer Banner-Nachricht im Chat
function createBannerMessage(content, type = "info") {
    const banner = document.createElement("div");
    banner.className = `chat-banner ${type}`;
    banner.innerHTML = content;
    document.body.appendChild(banner);

    // Banner nach 15 Sekunden entfernen
    setTimeout(() => {
        banner.remove();
    }, 15000); // Zeit in Millisekunden
	
	// Ton abspielen
    const audio = new Audio('modules/chris-narrative-hits/audio/notification.wav');
    audio.play();
}
// Definiert eine Funktion, die basierend auf dem Angriffstyp eine zufällige narrative Beschreibung erstellt.
function createNarrativeDescription(attackType, actorName, targetName) {
	// Speichert narrative Sätze für unterschiedliche Angriffstypen in einem Objekt.
    const narratives = {
        mwak: [
            `${actorName} katapultiert sich mit einem mächtigen Sprung über ein Hindernis, landet federleicht und entfesselt ohne Verzögerung einen vernichtenden Schlag gegen ${targetName}. Der plötzliche, kraftvolle Treffer wirbelt Staub auf und lässt ${targetName} taumeln.`,
			`In einer beeindruckenden Demonstration von Agilität duckt sich ${actorName} unter einem wilden Schwung von ${targetName} weg, rutscht nah heran und entfesselt einen schnellen, messerscharfen Gegenstoß. Der Angriff trifft so hart und schnell, dass er ${targetName} den Atem raubt.`,
			`${actorName} stürzt sich mit einem donnernden Kriegsschrei vorwärts und entfesselt eine Woge roher Energie. Der gewaltige Angriff trifft ${targetName} wie ein Hammer, zwingt ihn zurück und lässt die Erde unter seinen Füßen erzittern.`,
			`Im Augenblick tödlicher Stille fokussiert ${actorName}, zielend auf eine kaum sichtbare Lücke in ${targetName}s Verteidigung. Der folgende Schlag ist blitzschnell und so präzise, dass er durch die Luft zischt, bevor er mit einem lauten Knall auftrifft.`,
			`Unsichtbar wie ein Geist nähert sich ${actorName} seinem nichtsahnenden Gegner. Mit einem plötzlichen, leisen Swoosh materialisiert sein Angriff aus dem Nichts, trifft ${targetName} heftig und lässt ihn nach Luft schnappen.`,
			`Mit einem Schrei, der das Blut gefrieren lässt, signalisiert ${actorName} den Beginn eines brutalen Angriffs. Der kraftvolle Schlag, unterstützt durch das Echo des Schreis, trifft ${targetName}, schickt Schockwellen durch seine Rüstung und zermürbt seinen Geist.`,
			`${actorName} tanzt um ${targetName} herum, jeder Schlag und Tritt ein Teil einer vernichtenden Choreographie. Dieser Tanz ist nicht nur schön, sondern auch tödlich, treibt ${targetName} immer weiter zurück, umringt von der Drohung unerbittlicher Schläge.`,
			`Wie ein Tornado umschwirrt ${actorName} ${targetName}, entfesselt eine Serie von blitzartigen Angriffen. Jeder Schlag pfeift durch die Luft, trifft mit einer Geschwindigkeit, die kaum zu folgen ist, und lässt ${targetName} in einer verzweifelten Verteidigungshaltung zurück.`,
			`Mit ruhiger Berechnung beobachtet ${actorName} jede Bewegung seines Gegners. Im perfekten Moment entfesselt er einen präzisen, mächtigen Schlag, der die Luft zerteilt und direkt auf eine kritische Stelle in ${targetName}s Rüstung zielt.`,
			`${actorName} lässt einen unaufhörlichen Strom von Angriffen los, jede Bewegung eine Demonstration roher Kraft. ${targetName} wird von der Wucht und Frequenz der Schläge überwältigt, jede Verteidigung scheint vergeblich gegen die anhaltende Flut.`,
],
        rwak: [
            `Mit einem gewandten Sprung positioniert sich ${actorName} auf einer erhöhten Position, um einen klaren Schusswinkel auf ${targetName} zu haben. Der Pfeil/Bolzen fliegt durch die Luft, getragen von Präzision und Entschlossenheit, und trifft sein Ziel mit einem kaum hörbaren Geräusch.`,
			`In einer blitzschnellen Bewegung lädt ${actorName} die Armbrust/nimmt einen neuen Pfeil, ohne den Blick von ${targetName} abzuwenden. Der Schuss erfolgt so schnell, dass ${targetName} kaum Zeit hat zu reagieren, bevor der Bolzen/Pfeil sein Ziel findet.`,
			`Mit einem Brüllen der Entschlossenheit lässt ${actorName} einen Pfeil/Bolzen auf ${targetName} los, die Kraft des Schreis scheint den Schuss zu begleiten. Der Angriff durchbricht die Luft mit Autorität und trifft ${targetName} mit unerwarteter Wucht.`,
			`Mit einer ruhigen und präzisen Bewegung visiert ${actorName} ${targetName} an, die Welt um sich herum ausblendend. Der Moment des Loslassens ist still und kontrolliert, der Pfeil/Bolzen findet sein Ziel mit einer Präzision, die nur durch jahrelange Übung erreicht wird.`,
			`Wie ein Schatten, der über das Schlachtfeld huscht, bewegt sich ${actorName}, kaum wahrnehmbar und leise. Der abgefeuerte Pfeil/Bolzen verrät die Position, doch trifft er ${targetName} so unerwartet, dass es wie ein Angriff aus dem Nichts scheint.`,
			`Mit einem Kriegsschrei, der das Blut in den Adern gefrieren lässt, signalisiert ${actorName} den bevorstehenden Angriff. Der darauffolgende Schuss, getragen von der Intensität des Schreis, lässt ${targetName} innehalten, bevor es von dem Bolzen/Pfeil getroffen wird.`,
			`In einem Tanz der Zerstörung bewegt sich ${actorName} geschickt, um immer wieder neue Schusswinkel zu finden. Jeder Schuss folgt dem anderen in einem Rhythmus, der ${targetName} kaum eine Atempause lässt und jeden Versuch eines Gegenangriffs zunichtemacht.`,
			`Mit einer Bewegung, schnell wie der Wind, wechselt ${actorName} die Position, immer in Bewegung, um ein schwieriges Ziel abzugeben. Die Schüsse sind so schnell und unvorhersehbar wie Böen eines Sturms, die ${targetName} in Bedrängnis bringen.`,
			`Mit der Präzision eines erfahrenen Kriegers kalkuliert ${actorName} Wind und Distanz, bevor ein Pfeil/Bolzen abgeschossen wird. Dieser Schuss ist das Ergebnis sorgfältiger Planung und trifft ${targetName} an einem kritischen Punkt.`,
			`Wie ein unerbittlicher Sturm entfesselt ${actorName} eine Salve nach der anderen auf ${targetName}, die Schüsse kommen schnell und hart. Jeder Pfeil trägt die Energie und Entschlossenheit von ${actorName}, ${targetName} mit einem unaufhaltsamen Hagel zu überwältigen.`,
]
    };
	// Überprüft, ob für den gegebenen Angriffstyp narrative Sätze vorhanden sind, und wählt einen zufälligen Satz aus.
    if (narratives[attackType]) {
        const randomIndex = Math.floor(Math.random() * narratives[attackType].length);
        return narratives[attackType][randomIndex];
    }

    return ''; // Gibt einen leeren String zurück, falls kein Angriffstyp übereinstimmt.
}
// Registriert einen Event-Listener für den 'dnd5e.rollAttack'-Hook, der bei jedem Angriffswurf ausgelöst wird.
Hooks.on("dnd5e.rollAttack", (item, roll) => {
    if (!roll) return; // Beendet die Funktion, wenn kein Wurf-Ergebnis vorhanden ist.

    const actor = item.actor; // Der Akteur, der den Angriff ausführt
    const targets = game.user.targets; // Die ausgewählten Ziele des angreifenden Spielers
    if (targets.size === 0) {
        console.log("Keine Ziele ausgewählt. Breche ab...");
        return;
    }

    const actionType = item.system.actionType; // Zugriff auf die actionType-Eigenschaft des Items
    let attackTypeName = ""; // Initialisiert den Angriffstyp-Namen.
    // Bestimmung des Angriffstyps basierend auf dem actionType des Items
    switch (actionType) {
        case 'mwak':
            attackTypeName = "Nahkampfwaffenangriff";
            break;
        case 'rwak':
            attackTypeName = "Fernkampfwaffenangriff";
            break;
        case "msak": // Melee Spell Attack
            attackTypeName = "Nahkampfzauberangriff";
            break;
        case "rsak": // Ranged Spell Attack
            attackTypeName = "Fernkampfzauberangriff";
            break;
        default:
            attackTypeName = "Angriff";
            break;
    }

    // Abbildung von Schadensarten-Kürzeln zu benutzerfreundlichen Namen
    const damageTypeNames = {
        "acid": "Säureschaden",
        "bludgeoning": "Wuchtschaden",
        "cold": "Kälteschaden",
        "fire": "Feuerschaden",
        "force": "Energieschaden",
        "lightning": "Blitzschaden",
        "necrotic": "Nekrotischer Schaden",
        "piercing": "Stichschaden",
        "poison": "Giftschaden",
        "psychic": "Psychischer Schaden",
        "radiant": "Gleißender Schaden",
        "slashing": "Hiebschaden",
        "thunder": "Donnerschaden",
        // Füge hier weitere Schadensarten hinzu, falls nötig
    };

    targets.forEach(target => {
        const targetAC = target.actor.system.attributes.ac.value; // Rüstungsklasse des Ziels
        if (roll.total > targetAC) {
			// Erstelle die narrative Beschreibung basierend auf dem Angriffstyp
            const narrative = createNarrativeDescription(actionType, actor.name, target.name);
            const damageParts = item.system.damage.parts; // Teile des Schadens, die vom Item verursacht werden.
            let damageTypes = damageParts.map(part => damageTypeNames[part[1]] || part[1]).join(", "); // Wandelt Schadensarten in Text um.
			// Erstellt den Inhalt der Chat-Nachricht mit Angriffsdetails und der narrativen Beschreibung.
            let messageContent = `${actor.name} hat einen erfolgreichen ${attackTypeName} mit ${damageTypes} auf ${target.name} ausgeführt!<br>${narrative}`;
			// Erstellt eine neue Chat-Nachricht mit den Angriffsdetails.
            ChatMessage.create({
                content: messageContent,
                speaker: ChatMessage.getSpeaker({actor: actor})
            });
			 // Erstelle das Banner
            createBannerMessage(messageContent, "success");
        } else {
            console.log(`Angriffswurf gegen ${target.name} fehlgeschlagen.`);
        }
    });
});