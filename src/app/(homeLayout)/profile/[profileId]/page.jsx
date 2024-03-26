import Image from "next/image";
import React from "react";

const Profile = () => {
  return (
    <div className="flex flex-col items-center">
      <Image
        alt="Profile Picture"
        className="w-32 h-32 rounded-full"
        width={128}
        height={128}
      />
      <h2 className="text-2xl font-bold mt-4">Name: John Doe</h2>
      <p className="text-lg">Email: johndoe@example.com</p>
      <h3 className="text-xl font-bold mt-4">Recent Arguments Activity:</h3>
      <ul className="list-disc ml-8">
        <li>Argument 1</li>
        <li>Argument 2</li>
        <li>Argument 3</li>
      </ul>
    </div>
  );
};

export default Profile;
