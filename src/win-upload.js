/**
 * Winnetou Upload
 * @author Kaue Sedrez
 * https://github.com/kauesedrez
 *
 * License MIT
 *
 */

//@ts-ignore
import { Winnetou } from "../../winnetoujs/src/winnetou.js";

/**
 * WinnetouUpload is a class used
 * to automatically create
 * a drag and drop area for uploading files.
 */
export class WinnetouUpload {
  /**
   * Transforms a input file in a droppable label area.
   * The created label id is "win-upload-label".
   * Classes are: "win-upload-label", "&.dragenter" and "&.drop"
   * @param {object} data data object
   * @param {string} data.form form id (without #)
   * @param {string} data.input input id (without #)
   * @param {string} data.string the localized string to show on drop box
   */
  constructor(data) {
    this.form = data.form;
    this.input = data.input;
    this.string = data.string;
    this.transform();
  }

  /**@private */
  transform() {
    Winnetou.select(this.form).append(`
      <label id='win-upload-label' for='${this.input}' class='win-upload-label'>
      ${this.string}
      </label>
    `);
    Winnetou.select(this.input).hide();
  }

  /**
   * Method that adds drop listeners to the label
   * @param {function} callback a function to be called when user add files, returns an array of blob strings
   *
   */
  onFiles(callback) {
    Winnetou.listen("dragover", "#win-upload-label", e => {
      e.preventDefault();
    });
    Winnetou.listen("dragenter", "#win-upload-label", e => {
      Winnetou.select("#win-upload-label").addClass("dragenter");
    });
    Winnetou.listen("dragleave", "#win-upload-label", e => {
      Winnetou.select("#win-upload-label").removeClass("dragenter");
    });
    Winnetou.listen("drop", "#win-upload-label", e => {
      e.preventDefault();
      Winnetou.select("#win-upload-label").addClass("drop");
      document.getElementById(this.input)["files"] =
        e.dataTransfer.files;
      let thumbs = this.getThumbs();
      callback(thumbs);
    });
    Winnetou.listen("change", this.input, e => {
      let thumbs = this.getThumbs();
      callback(thumbs);
    });
  }

  /**
   * Get the thumbs of files added to the input field.
   * @returns {Array.<string>} thumbs blob array
   */
  getThumbs() {
    let files = Winnetou.select(this.input).getFiles();
    let thumbs = [];
    for (let c = 0; c < files.length; c++) {
      let file = files[c];
      // @ts-ignore
      thumbs.push(URL.createObjectURL(file));
    }
    return thumbs;
  }

  /**
   * Clear input file files
   * @param {function} callback callback with empty array
   */
  clear(callback) {
    document.getElementById(this.input)["value"] = "";
    let thumbs = this.getThumbs();
    callback(thumbs);
  }

  /**
   * Create a XMLHttpRequest to send formData via ajax, handling upload progress and returning a promise when completes.
   * @param {string} url url to upload
   * @param {function} fx function to handle upload progress, receive a param with progress percentage
   * @returns {Promise.<string>} resolve("success") or reject(error message)
   */
  send(url, fx) {
    return new Promise(async (resolve, reject) => {
      let form = document.getElementById(this.form);
      //@ts-ignore
      let formData = new FormData(form);
      let xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.responseType = "json";
      xhr.upload.onprogress = e => {
        if (e.lengthComputable) {
          var ratio = Math.floor((e.loaded / e.total) * 100);
          fx(ratio);
        }
      };
      xhr.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
          return resolve(this.response || !0);
        }
        if (this.readyState == 4 && this.status != 200) {
          return reject(
            `Impossible to send formData. Error code 2333e43. Status Code: ${this.status}`
          );
        }
      };
      xhr.send(formData);
    });
  }
}
