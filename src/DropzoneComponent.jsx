import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { resourceDir, resolveResource, appLocalDataDir } from '@tauri-apps/api/path';
import { BaseDirectory, readTextFile, writeTextFile } from '@tauri-apps/api/fs';
import { invoke } from "@tauri-apps/api/tauri";
import { info } from "tauri-plugin-log-api";

function DropzoneComponent({ onChangeFilePath }) {
  const onDrop = useCallback(acceptedFiles => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = async () => {
        const mystr = reader.result;
        await writeTextFile({ path: file.name, contents: mystr }, { dir: BaseDirectory.AppLocalData });
        // let fileContent = await invoke("read_my_file", { myPath:file.path });
        onChangeFilePath("/home/daniel/.local/share/com.tsv.dev/"+file.path);
        info(file.name);
      }
      reader.readAsText(file);
    })
    // info(acceptedFiles);
    // console.log(await appLocalDataDir());
  }, []);
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  return (
    <div {...getRootProps({className: 'dropzone'})}>
      <input {...getInputProps()} />
      {
        isDragActive ?
          <p>Drop the files here ...</p> :
          <p>Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default DropzoneComponent;