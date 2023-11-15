import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { resourceDir, resolveResource, appLocalDataDir } from '@tauri-apps/api/path';
import { BaseDirectory, readTextFile } from '@tauri-apps/api/fs';
import { info } from "tauri-plugin-log-api";
import DropzoneComponent from './DropzoneComponent';
import TableTSVComponent from './TableTSVComponent';
import "./App.css";

function App() {
  const [filePath, setFilePath] = useState("/home/daniel/.local/share/com.tsv.dev/tq_LUK.tsv");
  const [fileName, setFileName] = useState("tq_LUK.tsv");
  const [fileCont, setFileCont] = useState("");

  async function load() {
    const appDataDirPath = await appLocalDataDir();
    console.log("loading :"+appDataDirPath+fileName);
    setFilePath(appDataDirPath+fileName);
    
    // info(filePath);
    if(filePath.length > 2) {
      let fileContent = await invoke("read_my_file", { myPath:filePath });
      setFileCont(fileContent);
    }
    // let test = await invoke("test");
    // info(fileContent);
  }


  return (
    <div className="container">
      <h1>Psomiso</h1>

      <div className="row">
        <DropzoneComponent onChangeFilePath={setFilePath} />
      </div>

      <div className="row">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            load();
          }}
        >
        <label>
          <span id="tpl">
            <input
              id="load-input"
              onChange={async (e) => {
                  setFilePath(e.currentTarget.value);
                  setFileName(e.currentTarget.value.split("/").pop())
                }
              }
              placeholder="upload a file"
              defaultValue={filePath}
            />
          </span>
        </label>
        <button type="submit">Load</button>
        </form>
      </div>

      { fileCont == "" ?
        <p>No text</p>
        :
        <TableTSVComponent fileName={fileName} fullTxt={fileCont} /> 
      }
    </div>
  );
}

export default App;
