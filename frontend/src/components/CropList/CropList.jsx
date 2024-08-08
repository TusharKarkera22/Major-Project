import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const CropList = ({ signer, contractBundle }) => {
  const [crops, setCrops] = useState([]);

  const fetchCrops = async () => {
    try {
      const allCrops = await contractBundle.cropTradingContract.getAllCrops();
      setCrops(allCrops);
    } catch (error) {
      console.error("Error fetching crops:", error);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Available Crops</h1>
      {crops.length === 0 ? (
        <p>No crops available.</p>
      ) : (
        crops.map((crop, index) => (
          <div key={index} className='mt-4'>
            <p>Crop Name: {crop.cropName}</p>
            <p>Price per Unit: {ethers.utils.formatUnits(crop.pricePerUnit, 'ether')} ETH</p>
            <p>Available Units: {crop.availableUnits.toString()}</p>
            <p>Is Available: {crop.isAvailable ? 'Yes' : 'No'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default CropList;
