const pickerOpts = {
  types: [
    {
      description: "Subtitles",
      accept: {
        "text/plain": [".srt"],
      },
    },
  ],
  excludeAcceptAllOption: true,
  multiple: false,
};

let subtitles = [];

async function getFile() {
  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);
  const fileData = await fileHandle.getFile();
  const text = await fileData.text();

  subtitles = text.split("\n"); 
  console.log("File content:", subtitles);
}


function addMilliseconds(hours, minutes, seconds, milliseconds, amount) {
  milliseconds += amount;
  while (milliseconds >= 1000) {
    milliseconds -= 1000;
    seconds += 1;
    if (seconds >= 60) {
      seconds -= 60;
      minutes += 1;
      if (minutes >= 60) {
        minutes -= 60;
        hours += 1;
      }
    }
  }
  return { hours, minutes, seconds, milliseconds };
}

async function shiftSubtitles() {
  const shiftAmount = parseInt(document.getElementById("milliseconds").value);

  if (isNaN(shiftAmount)) {
    alert("Введите корректное количество миллисекунд для сдвига.");
    return;
  }

  for (let i = 0; i < subtitles.length; i++) {
    if (subtitles[i].includes(" --> ")) {
      const [startTime, endTime] = subtitles[i].split(" --> ");

      let [startHours, startMinutes, startSeconds] = startTime.split(":");
      let [startSecs, startMillis] = startSeconds.split(",");
      startHours = parseInt(startHours);
      startMinutes = parseInt(startMinutes);
      startSecs = parseInt(startSecs);
      startMillis = parseInt(startMillis);

      let [endHours, endMinutes, endSeconds] = endTime.split(":");
      let [endSecs, endMillis] = endSeconds.split(",");
      endHours = parseInt(endHours);
      endMinutes = parseInt(endMinutes);
      endSecs = parseInt(endSecs);
      endMillis = parseInt(endMillis);

      const newStartTime = addMilliseconds(startHours, startMinutes, startSecs, startMillis, shiftAmount);
      const newEndTime = addMilliseconds(endHours, endMinutes, endSecs, endMillis, shiftAmount);

      const formattedStart = `${String(newStartTime.hours).padStart(2, "0")}:${String(newStartTime.minutes).padStart(2, "0")}:${String(newStartTime.seconds).padStart(2, "0")},${String(newStartTime.milliseconds).padStart(3, "0")}`;
      const formattedEnd = `${String(newEndTime.hours).padStart(2, "0")}:${String(newEndTime.minutes).padStart(2, "0")}:${String(newEndTime.seconds).padStart(2, "0")},${String(newEndTime.milliseconds).padStart(3, "0")}`;

      subtitles[i] = `${formattedStart} --> ${formattedEnd}`;
    }
  }

  const updatedContent = subtitles.join("\n");
  await saveFile(updatedContent);
}

async function saveFile(content) {
  const newHandle = await window.showSaveFilePicker({
    types: [
      {
        description: "Subtitles",
        accept: {
          "text/plain": [".srt"],
        },
      },
    ],
  });
  const writableStream = await newHandle.createWritable();
  await writableStream.write(content);
  await writableStream.close();
}
