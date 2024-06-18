// Globale Variable zur Speicherung der Übersetzungen
let translations = {};

// Funktion zum Laden der Übersetzungen basierend auf der aktuellen Sprache
async function loadTranslations(lang) {
    const response = await fetch(`modules/chris-narrative-hits/lang/${lang}.json`);
    translations = await response.json();
}

// Funktion zur Erstellung einer Banner-Nachricht im Chat und Abspielen eines Tons
function createBannerMessage(content, type = "info") {
    const banner = document.createElement("div");
    banner.className = `chat-banner ${type}`;
    banner.innerHTML = content;
    document.body.appendChild(banner);

    // Banner nach 15 Sekunden entfernen
    setTimeout(() => {
        banner.style.transition = 'opacity 1s';
        banner.style.opacity = '0';
        setTimeout(() => {
            banner.remove();
        }, 1000); // Zeit in Millisekunden, um sicherzustellen, dass das Banner nach dem Ausblenden entfernt wird
    }, 10000); // Zeit in Millisekunden

    // Ton abspielen
    const audio = new Audio('modules/chris-narrative-hits/audio/notification.wav');
    audio.play();
}

// Funktion zur Erstellung einer narrativen Beschreibung basierend auf dem Angriffstyp
function createNarrativeDescription(attackType, actorName, targetName) {
    const narratives = translations.narratives[attackType];
    if (narratives) {
        const randomIndex = Math.floor(Math.random() * narratives.length);
        let narrative = narratives[randomIndex];
        narrative = narrative.replace(/\${actorName}/g, actorName);
        narrative = narrative.replace(/\${targetName}/g, targetName);
        return narrative;
    }
    return ''; // Gibt einen leeren String zurück, falls kein Angriffstyp übereinstimmt.
}

// Registriert einen Event-Listener für den 'dnd5e.rollAttack'-Hook, der bei jedem Angriffswurf ausgelöst wird.
Hooks.on("dnd5e.rollAttack", async (item, roll) => {
    if (!roll) return; // Beendet die Funktion, wenn kein Wurf-Ergebnis vorhanden ist.

    // Lade die Übersetzungen basierend auf der aktuellen Sprache
    const lang = game.i18n.lang;
    await loadTranslations(lang);

    const actor = item.actor; // Der Akteur, der den Angriff ausführt
    const targets = game.user.targets; // Die ausgewählten Ziele des angreifenden Spielers
    if (targets.size === 0) {
        console.log("Keine Ziele ausgewählt. Breche ab...");
        return;
    }

    const actionType = item.system.actionType; // Zugriff auf die actionType-Eigenschaft des Items
    const attackTypeName = translations.attackTypes[actionType] || translations.attackTypes.default;

    const damageTypeNames = translations.damageTypes;

    targets.forEach(target => {
        const targetAC = target.actor.system.attributes.ac.value; // Rüstungsklasse des Ziels
        if (roll.total > targetAC) {
            const narrative = createNarrativeDescription(actionType, actor.name, target.name);
            const damageParts = item.system.damage.parts; // Teile des Schadens, die vom Item verursacht werden.
            let damageTypes = damageParts.map(part => damageTypeNames[part[1]] || part[1]).join(", "); // Wandelt Schadensarten in Text um.
            let messageContent = `${actor.name} ${translations.banner.success} ${attackTypeName} ${translations.phrases.with} ${damageTypes} ${translations.phrases.on} ${target.name} ${translations.banner.conclusion}!<br><br>${narrative}`;
            ChatMessage.create({
                content: messageContent,
                speaker: ChatMessage.getSpeaker({actor: actor})
            });
            // Erstelle das Banner
            createBannerMessage(messageContent, "success");
        } else {
            console.log(`Angriffswurf gegen ${target.name} ${translations.banner.failure}.`);
        }
    });
});