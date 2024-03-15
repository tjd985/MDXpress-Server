const CONSTANTS = {
  EXPIRED_SECOND: 259200,
  BOILER_PLATE_CODE:
    "export const Highlight = ({children, color}) => (\n" +
    "  <span\n" +
    "    style={{\n" +
    "      backgroundColor: color,\n" +
    '      borderRadius: "2px",\n' +
    '      color: "#fff",\n' +
    '      padding: "0.2rem",\n' +
    "    }}>\n" +
    "    {children}\n" +
    "  </span>\n" +
    ");\n" +
    "\n" +
    '# Welcomde to <Highlight color="#25c2a0">MDXpress!</Highlight>\n' +
    "- Feel free to write code using MDX syntax in the editor on the left!<br/>\n" +
    '- We display a <Highlight color="#1877F2">**_real-time preview_**</Highlight> on the right.<br/>\n' +
    '- Press <Highlight color="#1877F2">cmd + s</Highlight> to save your current code, and you can share it with others via a link!\n' +
    "\n" +
    "I can write _**Markdown**_ alongside my _**JSX!**_\n" +
    "\n" +
    "### enjoy it!",
};

module.exports = CONSTANTS;
