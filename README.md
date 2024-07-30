# Chris's Narrative Hits

## Description

Chris's Narrative Hits is a module for Foundry Virtual Tabletop that generates a narrative description in the chat and displays a banner message whenever an attack against an NPC is successful. Additionally, a notification sound is played.

## Installation

1. Open Foundry VTT and navigate to the Module Settings.
2. Enable the module in the Module Management screen.

## Usage

### Attacks
- Each time an attack against an NPC is successful, a narrative description is automatically generated in the chat.
- A banner is displayed and a sound is played to mark the successful attack.

### Manual Banner Message
- To create a manual banner message, enter the following command in the chat:
/banner <message>

Example:
/banner This is a test message


## Configuration

### Language Support
- The module currently supports English and German.
- The language files are located in the `lang/` directory.

### Customization
- Notification sounds can be changed in the `audio/` directory.
- Styles for banner messages can be customized in the `css/styles.css` file.

## Developer

- **Chrisrous** - [GitHub](https://github.com/Chrisrous)

## Troubleshooting

If you encounter issues with the module, you can open your browser console (F12) and look for error messages. This information is helpful when reporting a problem.

## Contributions

Contributions are welcome! If you find a bug or have a suggestion for improvement, please open an issue on GitHub or create a pull request.

## License

This project is licensed under the MIT License.
