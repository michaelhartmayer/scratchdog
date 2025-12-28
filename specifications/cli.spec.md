# Spec CLI Specification

1. CLI that can be used with npm run specter <command> <args>  
    1.1. Commands  
        1.1.1. list [folder]  
            1.1.1.1. Lists all specification files in the <folder> folder, recursively.  
            1.1.1.2. If no arguments are provided, lists all specification files  
                1.1.1.2.1. Specification files are identified as *.spec.md  
            1.1.1.3. Nested folders are namespaced with the path preceding it.  
            1.1.1.4. Output is formatted as a list of files.  
                1.1.1.4.1. Each file is displayed with its path and name.  
                1.1.1.4.2. Each file is displayed with its number of total specification lines.  
            1.1.1.5. --help flag displays the help message for the list command.  
            1.1.1.6. --json flag displays the list as a JSON object.  
        1.1.2. toc <file> [section]  
            1.1.2.1. Displays the table of contents for the <file> file.  
            1.1.2.2. <section> is optional and defaults to the entire file.  
            1.1.2.3. List is limited to the top level sections of the level specified by <section>, and does not show any nested sections.  
            1.1.2.4. Output is formatted as a list of sections.  
                1.1.2.4.1. Each section is displayed with its name and number of total specification lines.  
            1.1.2.5. --help flag displays the help message for the toc command.  
            1.1.2.6. <section> may incude a trailing period or not.  
            1.1.2.7. --json flag displays the toc as a JSON object.  
        1.1.3. spec <file> [section]  
            1.1.3.1. Displays the specification for the <file> file.  
            1.1.3.2. <section> is optional and defaults to the entire file.  
            1.1.3.3. List includes all nested sections of the specified section.  
            1.1.3.4. Output is formatted as a list of sections.  
            1.1.3.5. --help flag displays the help message for the spec command.  
            1.1.3.6. <section> may incude a trailing period or not.  
            1.1.3.7. --json flag displays the spec as a JSON object.  
        1.1.4. diff <file> [section]  
            1.1.4.1. Displays the specification for the <file> file.  
            1.1.4.2. <section> is optional and defaults to the entire file.  
            1.1.4.3. List includes all nested sections of the specified section.  
            1.1.4.4. Output is formatted as a list of sections.  
            1.1.4.5. Output is limited to changes since the last commit.  
            1.1.4.6. --help flag displays the help message for the diff command.  
            1.1.4.7. <section> may incude a trailing period or not.  
            1.1.4.8. --json flag displays the diff as a JSON object.  
        1.1.5. help  
            1.1.5.1. Displays the help message for the cli.  
            1.1.5.2. Output is formatted as a list of commands.  
                1.1.5.2.1. Each command is displayed with its name and description.  
        1.1.6. edit <file> <section> <content>  
            1.1.6.1. Updates the content of the specified <section> in <file> with <content>.  
            1.1.6.2. <content> replaces the existing specification text.  
            1.1.6.3. <section> must be a valid existing section.  
            1.1.6.4. --help flag displays the help message for the edit command.  
        1.1.7. add <file> <section> <content>  
            1.1.7.1. Appends a new specification item to the <section> in <file>.  
            1.1.7.2. The new item is numbered sequentially after the last existing child of <section>.  
            1.1.7.3. <content> is the text of the new item.  
            1.1.7.4. --help flag displays the help message for the add command.  
            1.1.7.5. Output returns the updated section as if running the toc command on the new item.  
            1.1.7.6. --json flag displays the added item as a JSON object, following the standard format.  
        1.1.8. create <folder> <filename> <title>
            1.1.8.1. Creates a new specification file at <folder>/<filename>.
            1.1.8.2. <filename> must end with .spec.md (is appended if missing).
            1.1.8.3. The file is initialized with the <title> as the main H1 header. If multiple arguments provided after filename, they are joined to form the title.
            1.1.8.4. --help flag displays the help message for the create command.
            1.1.8.5. --json flag displays the created file info as a JSON object.
    1.2. Package  
        1.2.1. Cli will live in /scripts/cli  
        1.2.2. JSON test item  
    1.3. CLI Text Output Standards  
        1.3.1. Help Text  
            1.3.1.1. Usage string must follow the format `Usage: npm run specter <command> [args]`  
            1.3.1.2. Command list must be aligned.  
                1.3.1.2.1. Command names and arguments column must be padded to a fixed width of 35 characters.  
                1.3.1.2.2. Descriptions must start aligned after the padding.  
            1.3.1.3. Arguments must use `<>` for required and `[]` for optional parameters.  
        1.3.2. General Output  
            1.3.2.1. All command outputs should use consistent spacing and indentation.  
            1.3.2.2. Error messages must start with "Error: ".  
        1.3.3. JSON Format  
            1.3.3.1. number: The section number without a trailing period.  
            1.3.3.2. name: The name of the section.  
            1.3.3.3. content: The text content of the section, stripped of indentation and numbering.  
            1.3.3.4. Level is not included in the output.  
            1.3.3.5. subsections: An array of nested sections defined recursively.  

