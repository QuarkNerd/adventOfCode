function solve(inputString) {
  const files = inputString.split("").map((x, i) => ({
    actualFile: !(i % 2),
    id: i % 2 ? null : i / 2,
    size: parseInt(x),
  }));

  const compressedP1 = compressPartOne(files);
  const compressedP2 = compressPartTwo(files);

  return [checkSum(compressedP1), checkSum(compressedP2)];
}

function compressPartOne(fileList) {
  const files = fileList.map((x) => ({ ...x }));
  const compressedFiles = [];

  let nextFile;
  while ((nextFile = files.shift())) {
    if (nextFile.actualFile) {
      compressedFiles.push(nextFile);
      continue;
    }
    while (nextFile.size > 0) {
      const endFile = getLastActualfile(files);
      if (!endFile) break;
      const smallerSize = Math.min(nextFile.size, endFile.size);
      compressedFiles.push({
        actualFile: true,
        id: endFile.id,
        size: smallerSize,
      });
      nextFile.size -= smallerSize;
      endFile.size -= smallerSize;

      if (endFile.size > 0) {
        files.push(endFile);
      }
    }
  }
  return compressedFiles;
}

function compressPartTwo(files) {
  for (let i = files.length - 1; i > 0; i--) {
    const file = files[i];
    if (!file || !file.actualFile) continue;

    for (let j = 1; j < i; j++) {
      const blank = files[j];
      if (blank.actualFile) continue;
      if (blank.size >= file.size) {
        const copyFile = { ...file };
        file.actualFile = false;
        files.splice(j, 0, copyFile);
        blank.size -= file.size;
        if (blank.size <= 0) {
          files.splice(j + 1, 1);
        }
        break;
      }
    }
  }

  return files;
}

function checkSum(compressedFiles) {
  let index = 0;
  let total = 0;
  compressedFiles.forEach(({ size, id, actualFile }) => {
    if (actualFile) total += (id * (2 * index + size - 1) * size) / 2;
    index += size;
  });
  return total;
}

function getLastActualfile(files) {
  let actualFile;
  let file;
  while ((file = files.pop())) {
    if (file.actualFile) {
      actualFile = file;
      break;
    }
  }
  return actualFile;
}

module.exports = solve;
