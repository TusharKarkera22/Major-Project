import React, { useState } from 'react';
import { ethers } from 'ethers';
const ListCrop = ({ signer, contractBundle }) => {
  const [cropName, setCropName] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [totalUnits, setTotalUnits] = useState('');

  const listCrop = async () => {
    try {
      const tx = await contractBundle.cropTradingContract.listCrop(
        cropName,
        ethers.utils.parseUnits(pricePerUnit, 'ether'),
        parseInt(totalUnits, 10)
      );
      await tx.wait();
      console.log("Crop listed successfully.");
    } catch (error) {
      console.error("Error listing the crop:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>List Crop</h1>
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={cropName}
        onChange={(e) => setCropName(e.target.value)}
        placeholder='Crop Name'
      />
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={pricePerUnit}
        onChange={(e) => setPricePerUnit(e.target.value)}
        placeholder='Price Per Unit (ETH)'
      />
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={totalUnits}
        onChange={(e) => setTotalUnits(e.target.value)}
        placeholder='Total Units'
      />
      <button className='bg-blue-500 text-white px-4 py-2 rounded' onClick={listCrop}>
        List Crop
      </button>
    </div>
  );
};

export default ListCrop;
