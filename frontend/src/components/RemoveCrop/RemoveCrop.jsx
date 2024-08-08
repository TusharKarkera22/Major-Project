import React, { useState } from 'react';

const RemoveCrop = ({ signer, contractBundle }) => {
  const [cropId, setCropId] = useState('');

  const removeCrop = async () => {
    try {
      const tx = await contractBundle.cropTradingContract.removeCrop(cropId);
      await tx.wait();
      console.log("Crop removed successfully.");
    } catch (error) {
      console.error("Error removing the crop:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Remove Crop</h1>
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
        placeholder='Crop ID'
      />
      <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={removeCrop}>
        Remove Crop
      </button>
    </div>
  );
};

export default RemoveCrop;
