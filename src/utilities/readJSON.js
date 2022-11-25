const readJSON = (file) =>
  new Promise((resolve, reject) => {
    // validate file type
    if (!file || file.type.toLowerCase() !== "application/JSON".toLowerCase()) {
      return reject({ message: "invalid file", error: true });
    }

    const fileReader = new FileReader();
    fileReader.readAsText(file, "UTF-8");

    fileReader.onload = (e) => {
      return resolve({
        data: JSON.parse(e.target.result),
        message: "successfully file loaded",
      });
    };

    fileReader.onerror = (error) => {
      return reject({ message: "something went to wrong", error });
    };
  });
export default readJSON;
