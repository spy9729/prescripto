import React, { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const DoctorProfile = () => {
  const { dToken, profileData, setProfileData, getProfileData } =
    useContext(DoctorContext);

  const { backendURL, currency } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateDocProfileData = async () => {
    try {
      const { data } = await axios.post(
        backendURL + "/api/doctor/update-profile",
        {
          fees: profileData.fees,
          available: profileData.available,
          address: profileData.address,
        },
        { headers: { dToken } },
      );

      if (data.success) {
        toast.success(data.message);
        await getProfileData();
        setIsEdit(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (dToken) {
      getProfileData();
    }
  }, [dToken]);

  if (!profileData) return null;

  return (
    <div className="m-5">
      <div className=" flex flex-col gap-4 ">
        <img
          className="w-full sm:max-w-60 rounded bg-primary/80"
          src={profileData.image}
          alt=""
        />

        <div className="flex-1 border border-stone-100 pounded-lg px-8 py-7 bg-white">
          <p className="font-medium text-3xl text-neutral-800 ">
            {profileData.name}
          </p>
          <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
            <p>
              {profileData.degree} - {profileData.speciality}
            </p>
            <button className="py-0.5 px-2 border border-gray-300 text-xs rounded-full">
              {profileData.experience}
            </button>
          </div>

          {/* About (READ ONLY) */}
          <div>
            <p className="flex items-center gap-1 text-sm font-medium text-neutral-800 mt-3">
              About:
            </p>
            <p className="text-gray-600 text-sm max-w-[700px] mt-1">
              {profileData.about}
            </p>
          </div>

          {/* Fees (EDITABLE) */}
          <div className="flex items-center mt-3 text-neutral-700">
            <p className="font-medium text-gray-500 mt-1">
              Appointment Fees:{" "}
              {isEdit ? (
                <input
                  className="bg-gray-100 px-2 max-w-32"
                  type="number"
                  value={profileData.fees}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      fees: e.target.value,
                    }))
                  }
                />
              ) : (
                <span className="text-gray-700">
                  {currency} {profileData.fees}
                </span>
              )}
            </p>
          </div>

          {/* Address (EDITABLE) */}
          <div className="flex gap-2 py-2">
            <p className="font-medium text-gray-500 mt-1">Address:</p>
            {isEdit ? (
              <div className="flex flex-col">
                <input
                  className="bg-gray-100 px-2 w-full text-sm mt-2"
                  value={profileData.address.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line1: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  className="bg-gray-100 px-2 w-full text-sm mt-2"
                  value={profileData.address.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: {
                        ...prev.address,
                        line2: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ) : (
              <p className="text-gray-500 text-sm mt-2">
                {profileData.address.line1}
                <br />
                {profileData.address.line2}
              </p>
            )}
          </div>

          {/* Availability (EDITABLE) */}
          <div className="flex items-center gap-1 pt-2 ">
            <input
              type="checkbox"
              className="accent-blue-600"
              checked={profileData.available}
              disabled={!isEdit}
              onChange={(e) =>
                setProfileData((prev) => ({
                  ...prev,
                  available: e.target.checked,
                }))
              }
            />
            <label>Available</label>
          </div>

          {/* Action Button */}
          <div className="mt-4 text-sm">
            {isEdit ? (
              <button
                className="border border-primary px-4 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all"
                onClick={updateDocProfileData}
              >
                Save Information
              </button>
            ) : (
              <button
                className="border border-primary px-4 py-1 rounded-full cursor-pointer hover:bg-primary hover:text-white transition-all"
                onClick={() => setIsEdit(true)}
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
