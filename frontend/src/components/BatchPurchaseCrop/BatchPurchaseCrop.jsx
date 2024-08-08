import React, { useState } from 'react';

const BatchPurchaseCrop = ({ signer, contractBundle }) => {
  const [cropIds, setCropIds] = useState([]);
  const [units, setUnits] = useState([]);

  const handleCropIdChange = (index, value) => {
    const newCropIds = [...cropIds];
    newCropIds[index] = value;
    setCropIds(newCropIds);
  };

  const handleUnitsChange = (index, value) => {
    const newUnits = [...units];
    newUnits[index] = value;
    setUnits(newUnits);
  };

  const addNewField = () => {
    setCropIds([...cropIds, '']);
    setUnits([...units, '']);
  };

  const batchPurchaseCrop = async () => {
    try {
      const tx = await contractBundle.cropTradingContract.batchPurchaseCrop(cropIds, units);
      await tx.wait();
      console.log("Batch purchase successful.");
    } catch (error) {
      console.error("Error in batch purchase:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Batch Purchase Crop</h1>
      {cropIds.map((_, index) => (
        <div key={index} className='flex gap-4'>
          <input
            type='text'
            className='border border-black rounded w-[100px] h-[40px]'
            value={cropIds[index]}
            onChange={(e) => handleCropIdChange(index, e.target.value)}
            placeholder='Crop ID'
          />
          <input
            type='text'
            className='border border-black rounded w-[100px] h-[40px]'
            value={units[index]}
            onChange={(e) => handleUnitsChange(index, e.target.value)}
            placeholder='Units'
          />
        </div>
      ))}
      <button className='bg-yellow-500 text-white px-4 py-2 rounded' onClick={addNewField}>
        Add More
      </button>
      <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={batchPurchaseCrop}>
        Batch Purchase
      </button>
    </div>
  );
};

export default BatchPurchaseCrop;
