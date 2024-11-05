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

async function getFile() {

  const [fileHandle] = await window.showOpenFilePicker(pickerOpts);

  const fileData = await fileHandle.getFile();
}
