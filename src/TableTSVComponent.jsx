// import { listen } from '@tauri-apps/api/event';
import React, { useState, useEffect } from 'react';
import { VariableSizeGrid as Grid } from "react-window";
import { info } from "tauri-plugin-log-api";
import { invoke } from "@tauri-apps/api/tauri";
import { appLocalDataDir } from '@tauri-apps/api/path';

const TableCell = ({defaultValue, r, c, onValChange}) => {
  const [row, setRow] = useState(r);
  const [column, setColumn] = useState(c);
  const [value, setValue] = useState(defaultValue);
  return <textarea className={c == 5 || c == 6 ? "last" : "first"} value={value} 
    onChange={e => {
      onValChange(e.target.value, column, row);
      setValue(e.target.value);
    }
  } />
}

function TableTSVComponent({ fileName, fullTxt="" }) {
  const [isText, setIsText] = useState(fullTxt != "");
  const [arrData, setArrData] = useState([]);
  // const [arrTableCell, setArrTableCell] = useState([]);
  const onValChange = (newVal, col, row) => {
    info("changed newVal == " + newVal + " col ==" + col + "  row == " + row);
    let tmpData = arrData;
    tmpData[row][col] = newVal;
    setArrData(arrData);
  }

  const onSave = async () => {
    const appDataDirPath = await appLocalDataDir();
    console.log("loading :"+appDataDirPath+fileName);
    let strBuff = "";

    arrData.forEach((row, indexRow) => {
      row.forEach((columnElem, indexCol) => {
        strBuff += columnElem
        if(indexCol < row.length-1) {
          strBuff += "\t"
        }
      });
      if(indexRow < arrData.length-1) strBuff += "\n";
    });

    await invoke("save_my_file", { myPath:appDataDirPath+fileName, myString: strBuff });
  }
  
  useEffect(() => {
    let arrLines = fullTxt.split("\n");
    arrLines = arrLines.map(line => line.split("\t"));
    setArrData(arrLines);
  }, [fullTxt]);


  function parseIt() {
    if(arrData[0] != null) {
      let headers = arrData[0];
      let body = arrData.slice(1).filter(e => e != "" && e != "\n");
      console.log(body.at(-1));
      return (
        <table>
          <thead>
            <tr>
            {
              headers.map((h, i) => <th class={ i == 5 || i == 6 ? "absorbing-column" : "decrease-column"} key={h+""+0+""+i}><TableCell defaultValue={h} r={0} c={i} onValChange={onValChange}/></th>)
            }
            </tr>
          </thead>
          <tbody>
            {
              body.map((elem, indexRow) => <tr>{elem.map((e, indexCol) => <td key={e+""+indexRow+1+""+indexCol}><TableCell defaultValue={e} r={indexRow+1} c={indexCol} onValChange={onValChange}/></td>)}</tr>)
            }
          </tbody>
        </table>
      )
    } else {
      return <p>NO text</p>;
    }
  }
  
  return (
    <div>
      <div>
        <button className="tsv" onClick={onSave}>
            Save File
        </button>
      </div>
      {
        parseIt()
      }
    </div>
  )
}

export default TableTSVComponent;