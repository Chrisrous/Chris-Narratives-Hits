// Globale Variable zur Speicherung der Übersetzungen
let translations = {};

// Globale Variable zum Caching der aktuellen Sprache
let currentLang = "";

/**
 * Lädt Übersetzungen basierend auf der aktuellen Sprache.
 *
 * @async
 * @param {string} lang - Die Sprache, für die Übersetzungen geladen werden.
 * @returns {Promise<Object>} Die geladenen Übersetzungen.
 */
async function loadTranslations(lang) {
    try {
        // Übersetzungen nur neu laden, wenn sich die Sprache ändert
        if (currentLang === lang && Object.keys(translations).length > 0) {
            console.log("Übersetzungen bereits geladen für Sprache:", lang);
            return translations;
        }
        const response = await fetch(`modules/chris-narrative-hits/lang/${lang}.json`);
        translations = await response.json();
        currentLang = lang;
        console.log("Übersetzungen geladen:", translations);
        return translations;
    } catch (error) {
        console.error("Fehler beim Laden der Übersetzungen:", error);
        translations = {};
        return translations;
    }
}

/**
 * Erstellt eine Banner-Nachricht im Chat und spielt einen Ton ab.
 *
 * @param {string} content - Der Inhalt der Banner-Nachricht.
 * @param {string} [type="info"] - Der Typ der Nachricht (z. B. "info", "success").
 * @returns {void}
 */
function createBannerMessage(content, type = "info") {
    try {
        console.log("Erstelle Banner-Nachricht:", content, type);
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
                console.log("Banner entfernt");
            }, 1000);
        }, 10000);

        // Ton abspielen
        const audio = new Audio('modules/chris-narrative-hits/audio/notification.wav');
        audio.play().then(() => {
            console.log("Ton erfolgreich abgespielt");
        }).catch(error => {
            console.error("Fehler beim Abspielen des Tons:", error);
        });
    } catch (error) {
        console.error("Fehler in createBannerMessage:", error);
    }
}

/**
 * Erstellt eine narrative Beschreibung basierend auf dem Angriffstyp.
 *
 * @param {string} attackType - Der Typ des Angriffs.
 * @param {string} actorName - Der Name des Angreifers.
 * @param {string} targetName - Der Name des Ziels.
 * @returns {string} Die narrative Beschreibung oder einen leeren String, falls keine passende Beschreibung gefunden wird.
 */
function createNarrativeDescription(attackType, actorName, targetName) {
    try {
        const narratives = translations.narratives[attackType];
        if (narratives) {
            const randomIndex = Math.floor(Math.random() * narratives.length);
            let narrative = narratives[randomIndex];
            narrative = narrative.replace(/\${actorName}/g, actorName);
            narrative = narrative.replace(/\${targetName}/g, targetName);
            return narrative;
        }
        return '';
    } catch (error) {
        console.error("Fehler in createNarrativeDescription:", error);
        return '';
    }
}

/**
 * Sendet eine Banner-Nachricht an alle Clients.
 *
 * @param {string} content - Der Inhalt der Nachricht.
 * @param {string} type - Der Typ der Nachricht.
 * @returns {void}
 */
function sendBannerMessageToAll(content, type) {
    try {
        if (game.socket) {
            console.log("Bereit zum Senden der Banner-Nachricht an alle:", content, type);
            game.socket.emit('module.chris-narrative-hits', {
                action: 'createBannerMessage',
                content: content,
                type: type
            });
            console.log("Banner-Nachricht gesendet:", content, type);

            // Zeigt Banner und spielt Audio beim ausführenden Spieler
            createBannerMessage(content, type);
        } else {
            console.error('Socket connection not available');
        }
    } catch (error) {
        console.error("Fehler in sendBannerMessageToAll:", error);
    }
}

// Listener für eingehende Socket-Nachrichten
Hooks.once('ready', () => {
    if (game.socket) {
        console.log("Socket-Verbindung initialisiert");
        game.socket.on('module.chris-narrative-hits', data => {
            console.log("Empfange Socket-Nachricht:", data);
            if (data.action === 'createBannerMessage') {
                console.log("Rufe createBannerMessage auf mit Daten:", data.content, data.type);
                createBannerMessage(data.content, data.type);
            } else {
                console.log("Unbekannte Aktion:", data.action);
            }
        });
    } else {
        console.error('Socket connection not available on ready');
    }

    // Registriere den benutzerdefinierten Chat-Befehl
    Hooks.on('chatMessage', (chatLog, messageText, chatData) => {
        try {
            const parts = messageText.trim().split(' ');
            const command = parts[0];
            const args = parts.slice(1);

            if (command === '/banner') {
                const content = args.join(' ');
                sendBannerMessageToAll(content, 'info');
                return false; // Verhindert, dass die Nachricht im Chat angezeigt wird
            }
        } catch (error) {
            console.error("Fehler im ChatMessage Listener:", error);
        }
    });
});

/**
 * Event-Listener für den 'dnd5e.rollAttack'-Hook, der bei jedem Angriffswurf ausgelöst wird.
 *
 * @param {Object} item - Das Item, das den Angriff ausführt.
 * @param {Object} roll - Das Ergebnis des Angriffswurfs.
 * @returns {Promise<void>}
 */
Hooks.on("dnd5e.rollAttack", async (item, roll) => {
    try {
        if (!roll) {
            console.log("Kein Wurf-Ergebnis vorhanden");
            return;
        }

        // Lade die Übersetzungen basierend auf der aktuellen Sprache
        const lang = game.i18n.lang;
        await loadTranslations(lang);

        const actor = item.actor;
        const targets = game.user.targets;
        if (targets.size === 0) {
            console.log("Keine Ziele ausgewählt. Breche ab...");
            return;
        }

        let actionType;
        try {
            // Zugriff auf die neue system.actionType-Eigenschaft
            actionType = item.system.actionType;
        } catch (error) {
            console.error("Fehler beim Zugriff auf actionType:", error);
            // Fallback, falls der Zugriff fehlschlägt
            actionType = "default";
        }

        const attackTypeName = translations.attackTypes[actionType] || translations.attackTypes.default;
        const damageTypeNames = translations.damageTypes;

        targets.forEach(target => {
            const targetAC = target.actor.system.attributes.ac.value;
            if (roll.total > targetAC) {
                const narrative = createNarrativeDescription(actionType, actor.name, target.name);
                // Überprüfe, ob Schadensbestandteile vorhanden sind, um Fehler zu vermeiden
                const damageParts = (item.system.damage && item.system.damage.parts) ? item.system.damage.parts : [];
                let damageTypes = "";
                if (damageParts.length > 0) {
                    damageTypes = damageParts.map(part => damageTypeNames[part[1]] || part[1]).join(", ");
                }
                // Nur wenn damageTypes vorhanden ist, den "with"-Teil einfügen
                const damageText = damageTypes.trim() ? `${translations.phrases.with} ${damageTypes} ` : "";
                let messageContent = `${actor.name} ${translations.banner.success} ${attackTypeName} ${damageText}${translations.phrases.on} ${target.name} ${translations.banner.conclusion}!<br><br>${narrative}`;
                console.log("Erstelle Chat-Nachricht:", messageContent);
                ChatMessage.create({
                    content: messageContent,
                    speaker: ChatMessage.getSpeaker({ actor: actor })
                });
                // Sende das Banner an alle
                sendBannerMessageToAll(messageContent, "success");
            } else {
                console.log(`Angriffswurf gegen ${target.name} ${translations.banner.failure}.`);
            }
        });
    } catch (error) {
        console.error("Fehler im dnd5e.rollAttack Hook:", error);
    }
});
