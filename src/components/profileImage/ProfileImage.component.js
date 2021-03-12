import React, { useState, useEffect } from "react";
import "./profileImage.styles.scss";

import Axios from "../../axios/axios";
import requests from "../../axios/requests";

const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
  },
};

export default function ProfileImage({ profileImage }) {
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAASFBMVEX///+hoaGbm5uioqK6urrm5uba2tr4+Pizs7OmpqawsLDo6Ojy8vKenp78/PyZmZnT09PExMTPz8/e3t6+vr7Hx8fW1taqqqr2IeWRAAACoklEQVR4nO3b626CMBiAYVoFUSmVg3r/dzpROYgtzEFivu599m8BEl8LtKhRBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI3+mwsuO3X9HH8tSsSpnrt1/Sx3apUZsVKbX/9kv6WNMgiVdzMjIbmGy9wx01DWhAg4b0BnmVlFW87HDCG2QHo29/xW7J4WQ3yJRRDXNdEkF2g8MjwS3CacHhRDeoVG/BQBDdoDRdAvtfG5z6BpoG/3ccZJs2gTnkfz+c6AZRodsGk9Oki7LniXEiu0FU6+Z0MPoytXlipweK8AZRmVqtt5Oj4HHG6MK7gfQG0S7LsulrwfU5l6x8G4hvMKtubx7Wt0vwDeLu/mm2nk1Cb5D1Uwila/c2gTfI00EDpd3XzsAbnLUa2jv3CrtBYl4SeD5LCbvBVY3oxLFVyA3yqxk3UNYxSwi5weU9gfNTtXAa5IW19fC/sXUkcM0SwmlQ6mZl1C8Pd28Xg+cl4e3RYzANTvd3fbAy2rrOhLvxrqE0aB+ndA+YS+1LYPajZwmhNOiesj/f5f4RkyPCaBkdSIO6XxndH5bk/gLq7dOIMBrE43e58F4MHtu87B1Eg+zl3L+tjBLvxWA4WFpBNBjdAvbOydFrhOEyOoQG5/G7PpvgNmceLKMDaOCeD84ZLKPlN/DNB2cMltHyGxx+MfJddNkeQXyDy8wtYCJCu4yW3iD+4yho7J83SOEN8okp8SyTPiIIbzAzH5zxXEbLbuBfHP5yJNy/sy+6QbaswM19GS25geuZ6acDoVlgSW6wtXoxexbdYJesoRLdYDVSG6jquNbPWI4Xob9jUcsvBR0j8fdMa/+uzej02y/pc8ftupZ99x8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJPgBXb0ypMSlaIYAAAAASUVORK5CYII="
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    getAccount();
  }, []);

  const getAccount = () => {
    Axios.get(
      `${requests.getAccount}/${localStorage.getItem("ts-userid")}`,
      config
    ).then((response) => {
      if (response.data.user !== null) {
        var userDetails = response.data.user;

        if (userDetails.profile_pic) {
          setImage(`http://twistshake.live/admin/${userDetails.profile_pic}`);
        }
      }
    });
  };

  const onChange = (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    const formData = new FormData();

    files.forEach((file, i) => {
      formData.append("image", file);
    });

    formData.append("id", localStorage.getItem("ts-userid"));
    Axios.post(requests.uploadProfile, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${localStorage.getItem("ts-token")}`,
      },
    }).then((res) => setImage(res.data.pic));
  };

  return (
    <div className="profile-image">
      <div className="buttons fadein">
        <div className="button">
          <label htmlFor="single">
            <img src={image} alt="" />
          </label>
          <input type="file" id="single" onChange={onChange} />
        </div>
      </div>

      {/* <img src={profileImage} alt="" /> */}
    </div>
  );
}
