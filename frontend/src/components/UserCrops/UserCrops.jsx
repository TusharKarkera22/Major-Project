import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

const UserCrops = ({ signer, contractBundle }) => {
  const [userCrops, setUserCrops] = useState([]);

  const fetchUserCrops = async () => {
    try {
      if (typeof contractBundle.cropTradingContract.getUserCrops === 'function') {
        const cropIds = await contractBundle.cropTradingContract.getUserCrops();
        const crops = await Promise.all(
          cropIds.map(async (id) => {
            const crop = await contractBundle.cropTradingContract.getCropDetails(id);
            return {
              id,
              cropName: crop.cropName,
              pricePerUnit: ethers.utils.formatUnits(crop.pricePerUnit, 'ether'),
              availableUnits: crop.availableUnits.toString(), // Convert BigNumber to string
              isAvailable: crop.isAvailable ? 'Yes' : 'No'
            };
          })
        );
        setUserCrops(crops);
      } else {
        console.error('getUserCrops function is not available in the contract.');
      }
    } catch (error) {
      console.error("Error fetching user crops:", error);
    }
  };

  useEffect(() => {
    fetchUserCrops();
  }, []);

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Your Listed Crops</h1>
      {userCrops.length === 0 ? (
        <p>No crops listed yet.</p>
      ) : (
        userCrops.map((crop, index) => (
          <div key={index} className='mt-4'>
            <p>Crop Name: {crop.cropName}</p>
            <p>Price per Unit: {crop.pricePerUnit} ETH</p>
            <p>Available Units: {crop.availableUnits}</p>
            <p>Is Available: {crop.isAvailable}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default UserCrops;
