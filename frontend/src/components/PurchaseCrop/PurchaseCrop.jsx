import React, { useState } from 'react';
import { ethers } from 'ethers';

const PurchaseCrop = ({ signer, contractBundle }) => {
  const [cropId, setCropId] = useState('');
  const [units, setUnits] = useState('');

  const purchaseCrop = async () => {
    try {
      // Fetch crop details using getCropDetails function
      const crop = await contractBundle.cropTradingContract.getCropDetails(cropId);
      const pricePerUnit = ethers.utils.formatUnits(crop.pricePerUnit, 'wei');
      const totalPrice = ethers.utils.parseUnits((pricePerUnit * units).toString(), 'wei');

      // Purchase the crop
      const tx = await contractBundle.cropTradingContract.purchaseCrop(
        cropId,
        parseInt(units, 10),
        { value: totalPrice } // Pass the total price with the transaction
      );
      await tx.wait();

      console.log("Crop purchased successfully.");
    } catch (error) {
      console.error("Error purchasing the crop:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Purchase Crop</h1>
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
        placeholder='Crop ID'
      />
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={units}
        onChange={(e) => setUnits(e.target.value)}
        placeholder='Units to Purchase'
      />
      <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={purchaseCrop}>
        Purchase Crop
      </button>
    </div>
  );
};

export default PurchaseCrop;
