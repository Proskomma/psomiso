// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use std::fs::File;
use std::fs;
use std::io::Read;
// use std::io;
// use std::path::Path;
// use tauri::api::file;
// use tauri::AppHandle;

use log;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    log::info!("The name param is {}", name);

    format!("{}", name)
}

#[tauri::command]
fn read_my_file(my_path: &str) -> String {
    if my_path.len() < 2 {
        return "nothing".into();
    }
    log::info!("(read_my_file) My path is : {}", my_path);
    // This will return an error
    // let mut file = File::open(my_path).map_err(|err| err.to_string());
    // let mut file = File::open(my_path);
    // let mut contents = String::new();
    // let from_path = Path::new(my_path);
    // let mut contents = File::open(my_path);
    let mut file = File::open(my_path).unwrap();
    let mut buffer = String::new();

    // read the whole file
    let _test_cont = file.read_to_string(&mut buffer).expect("failed to read the file");
    buffer
}

#[tauri::command]
fn save_my_file(my_path: &str, my_string: &str) {
    log::info!("(save_my_file) My path is : {}", my_path);
    // This will return an error
    // let mut file = File::open(my_path).map_err(|err| err.to_string());
    // let mut file = File::open(my_path);
    // let mut contents = String::new();
    // let from_path = Path::new(my_path);
    // let mut contents = File::open(my_path);
    
    let _ = fs::remove_file(my_path);
    // let mut file = File::options()
    //         .read(true)
    //         .write(true)
    //         .create(my_path);
    // fs::write(my_path, my_string);
    // read the whole file

    // log::info!("(save_my_file) writing : {}", my_string);
    let _ = fs::write(my_path, my_string);
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_log::Builder::default().build()) // <-- this line here
        .invoke_handler(tauri::generate_handler![greet, read_my_file, save_my_file])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
