import * as React from "react";
import { sp } from "@pnp/sp/presets/all";
import { IconButton } from "@fluentui/react/lib/Button";
import {
  TextField,
  MaskedTextField,
  ITextFieldStyles,
} from "@fluentui/react/lib/TextField";

import { Label, Modal } from "@fluentui/react";
import "./style.css";
import styles from "./Ssdl.module.scss";
import { DefaultButton, PrimaryButton } from "@fluentui/react/lib/Button";
interface IData {
  Title: string;
  BgImage: string;
  //   Icons: string;
  Id: null;
  url: string;
}

// let bgimage = require("../assets/welcome-dark.png");
let masterData: IData[] = [];
const MainComponent = (props: any) => {
  //   console.log("props", props.display);

  const [Data, setData] = React.useState<IData[]>(masterData);
  const [image, setImage] = React.useState(null);
  const [modalPopup, setModalPopup] = React.useState({
    condition: false,
    Title: "",
    BgImage: "",
    // Icons: "",
    Id: null,
    PreviousBgImage: "",
    // PreviousIcons: "",
    Url: "",
    Description: "click here",
  });
  const modalStyle = {
    main: {
      width: "30%",
      borderRadius: 6,
      padding: "0 20px 20px 20px",
    },
  };
  const textFieldStyle: Partial<ITextFieldStyles> = {
    root: {
      width: "70%",
    },
    fieldGroup: {
      "::after": {
        border: "1px solid #000",
      },
    },
  };
  const [selectedFile, setSelectedFile] = React.useState(null);
  //   const [selectedFile1, setSelectedFile1] = React.useState(null);

  //   const imageExtensions = [
  //     "jpg",
  //     "jpeg",
  //     "png",
  //     "gif",
  //     "webp",
  //     "bmp",
  //     "tiff",
  //     "tif",
  //     "heic",
  //     "ico",
  //     "avif",
  //     "jp3d",
  //     "jxl",
  //   ];

  //   const getFileExtension = (filename) => {
  //     return filename.split(".").pop();
  //   };
  const handleFileChange = (event, type) => {
    // const file = event.target.files[0];
    // if (!file) return;

    // const fileExtension = getFileExtension(file.name);
    // if (!imageExtensions.includes(fileExtension.toLowerCase())) {
    //   alert("Unsupported file format. Please select an image.");
    //   event.target.value = "";
    //   return;
    // }
    if (type == "BgImage") {
      const file = event.target.files[0];
      setSelectedFile(file);
      // } else if (type == "Icons") {
      //   const file = event.target.files[0];
      //   setSelectedFile1(file);
      // }
    }
  };

  const uploadImage = async () => {
    try {
      //   if (!selectedFile) {
      //     alert("Please select an image to upload.");
      //     return;
      //   }
      if (selectedFile) {
        let imageUrl = await getFileAsBase64DataUrl(selectedFile);
        modalPopup.BgImage = imageUrl.toString();
        setModalPopup({ ...modalPopup });
      }
      //   } else if (selectedFile1) {
      //     let IconUrl = await getFileAsBase64DataUrl(selectedFile1);
      //     modalPopup.Icons = IconUrl.toString();
      //     setModalPopup({ ...modalPopup });
      //   }

      await updateListItem({
        Title: modalPopup.Title,
        BgImage: modalPopup.BgImage
          ? modalPopup.BgImage
          : modalPopup.PreviousBgImage,
        // Icons: modalPopup.Icons ? modalPopup.Icons : modalPopup.PreviousIcons,
        Url: {
          Description: "click here",
          Url: `${modalPopup.Url}`,
        },
      });
      //   const updatedData = Data.map((item) => {
      //     if (item.Id === modalPopup.Id) {
      //       return {
      //         ...item,
      //         BgImage: modalPopup.BgImage
      //           ? modalPopup.BgImage
      //           : modalPopup.PreviousBgImage,
      //         Icons: modalPopup.Icons
      //           ? modalPopup.Icons
      //           : modalPopup.PreviousIcons,
      //       };
      //     } else {
      //       return item;
      //     }
      //   });

      //   // Set the updated Data array to the state
      //   setData(updatedData);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getFileAsBase64DataUrl = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        resolve(reader.result);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const updateListItem = async (object) => {
    await sp.web.lists
      .getByTitle("IntranetConfig")
      .items.getById(modalPopup.Id)
      .update(object)
      .then((arr) => {
        modalPopup.condition = false;
        modalPopup.BgImage = "";
        // modalPopup.Icons = "";
        modalPopup.PreviousBgImage = "";
        // modalPopup.PreviousIcons = "";
        modalPopup.Title = "";
        setSelectedFile(null);
        // setSelectedFile1(null);
        setModalPopup({ ...modalPopup });

        getData();
      })
      .catch((error) => {
        console.error("Error updating list item:", error);
      });
  };

  const getData = () => {
    sp.web.lists
      .getByTitle("IntranetConfig")
      .items.select("*, Url")
      // .expand("Url")
      .top(6)
      .get()
      .then((res) => {
        let tempArr: IData[] = [];
        res.forEach((data) => {
          console.log(data, "data");
          tempArr.push({
            Title: data.Title ? data.Title : "",
            BgImage: data.BgImage ? data.BgImage : "",
            // Icons: data.Icons ? data.Icons : "",
            Id: data.ID ? data.ID : null,
            url: data?.Url?.Url ? data?.Url.Url : "",
            //     url1: data.OData__x0055_rl1 ? data.OData__x0055_rl1 : "",
          });
        });
        console.log(tempArr);

        if (tempArr.length > 0) {
          setData([...tempArr]);
        }
        // console.log(tempArr);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const labelStyles = {
    root: {
      color: "#000",
      fontWeight: "bold",
      fontSize: "16px",
      textAlign: "center",
      margin: "10px 0px",
    },
  };

  React.useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div
        style={{
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {Data.map((value) => {
          return (
            <div className="parent">
              <div
                className={props.display === 1 ? "imgBox" : "imgBox_2 "}
                style={{
                  // width: "33.33%",
                  // height: "300px",
                  // backgroundSize: "cover",
                  // backgroundRepeat: "no-repeat",
                  backgroundImage: `url(${value.BgImage})`,
                  // backgroundPosition: "center",
                  // position: "relative",
                  cursor: props.display !== 1 ? "default" : "pointer",
                }}
              >
                {/* <a href={value.url} style={{ textDecoration: "none" }}> */}
                {/* <div className="addBtnPosition"> */}
                {props.display !== 1 ? (
                  <IconButton
                    iconProps={{ iconName: "EditSolid12" }}
                    title="Edit"
                    className="addBtn"
                    //   hidden={props.display !== 1}
                    onClick={() => {
                      modalPopup.condition = true;
                      modalPopup.Id = value.Id;
                      modalPopup.Title = value.Title;
                      modalPopup.PreviousBgImage = value.BgImage;
                      // modalPopup.PreviousIcons = value.Icons;
                      modalPopup.Url = value.url;
                      setModalPopup({ ...modalPopup });
                    }}
                  />
                ) : (
                  ""
                )}
                {/* </div> */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                  }}
                  onClick={() => {
                    props.display === 1 && value.url.trim() !== ""
                      ? window.open(value.url, "_blank")
                      : "";
                  }}
                  // href={value.url}
                  // style={{ textDecoration: "none" }}
                  // target="_blank"
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      flexDirection: "column",
                    }}
                  >
                    {/* <div
                    style={{
                      display: "flex",
                      justifyContent: "center",

                      alignItems: "center",
                    }}
                  >
                    <img src={value.Icons} alt="Image" width="50" height="50" />
                  </div> */}
                    <p
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "100%",
                        margin: 0,
                        fontSize: "30px",
                        //   textAlign: "center",
                        color: "#fff",
                        textShadow: "1px 1px 3px #000",
                      }}
                    >
                      {value.Title}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal isOpen={modalPopup.condition} styles={modalStyle}>
        <div>
          <Label styles={labelStyles}>Edit</Label>
          {/* <IconButton
            iconProps={{ iconName: "Cancel" }}
            onClick={() => {
              modalPopup.condition = false;
              setModalPopup({ ...modalPopup });
            }}
          /> */}
        </div>
        <div className={styles.inputSection}>
          <Label>Title</Label>
          <Label className={styles.colon}>:</Label>
          <TextField
            styles={textFieldStyle}
            value={modalPopup.Title}
            placeholder="Enter your value"
            onChange={(e, val) => {
              modalPopup.Title = val;
              setModalPopup({ ...modalPopup });
            }}
          />
        </div>
        <div className={styles.inputSection}>
          <Label htmlFor="">Background</Label>
          <Label className={styles.colon}>:</Label>
          <div className={styles.fileBtn}>
            <input
              id="BKFile"
              className={styles.fileSelectionBtn}
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .webp, .bmp, .tiff, .tif, .heic, .ico, .avif, .jp3d, .jxl"
              onChange={() => handleFileChange(event, "BgImage")}
            />
          </div>
        </div>
        {/* <div className={styles.inputSection}>
          <Label htmlFor="">Icon</Label>
          <Label className={styles.colon}>:</Label>
          <div className={styles.fileBtn}>
            <input
              id="IFile"
              className={styles.fileSelectionBtn}
              type="file"
              accept=".jpg, .jpeg, .png, .gif, .webp, .bmp, .tiff, .tif, .heic, .ico, .avif, .jp3d, .jxl"
              onChange={() => handleFileChange(event, "Icons")}
            />
          </div>
        </div> */}

        {/* urlsection */}

        <div className={styles.inputSection}>
          <Label>Url</Label>
          <Label className={styles.colon}>:</Label>
          <TextField
            styles={textFieldStyle}
            value={modalPopup.Url}
            placeholder="Enter your value"
            onChange={(e, val) => {
              modalPopup.Url = val;
              setModalPopup({ ...modalPopup });
            }}
          />
        </div>
        <div className={styles.btnSection}>
          {/* <button onClick={uploadImage} className={styles.saveBtn}>
            Save
          </button> */}
          <PrimaryButton text="Save" onClick={uploadImage} />
          <DefaultButton
            text="Cancel"
            onClick={() => {
              modalPopup.condition = false;
              setModalPopup({ ...modalPopup });
            }}
          />
          {/* <button
            onClick={() => {
              modalPopup.condition = false;
              setModalPopup({ ...modalPopup });
            }}
            className={styles.CancelBtn}
          >
            Cancel
          </button> */}
        </div>
      </Modal>
    </div>
  );
};
export default MainComponent;
