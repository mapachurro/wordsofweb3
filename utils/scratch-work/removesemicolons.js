const fs = require('fs');
const path = require('path');

const directory = path.join(__dirname, '../static');

function renameFilesRecursively(dir) {
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stats = fs.lstatSync(filePath);

        if (stats.isDirectory()) {
            renameFilesRecursively(filePath);
        } else {
            if (file.includes(';')) {
                const newFileName = file.replace(/;/g, '-');
                const newFilePath = path.join(dir, newFileName);
                fs.renameSync(filePath, newFilePath);
                console.log(`Renamed: ${filePath} -> ${newFilePath}`);
            }
        }
    });
}

renameFilesRecursively(directory);
