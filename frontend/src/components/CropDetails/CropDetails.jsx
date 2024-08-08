import React, { useState } from 'react';

const CropDetails = ({ signer, contractBundle }) => {
  const [cropId, setCropId] = useState('');
  const [cropDetails, setCropDetails] = useState(null);

  const fetchCropDetails = async () => {
    try {
      const details = await contractBundle.cropTradingContract.getCropDetails(cropId);
      setCropDetails(details);
    } catch (error) {
      console.error("Error fetching crop details:", error);
    }
  };

  return (
    <div className='flex flex-col justify-evenly w-[600px] h-[400px] gap-6 items-center bg-white rounded-xl'>
      <h1 className='font-contax text-2xl'>Crop Details</h1>
      <input
        type='text'
        className='border border-black rounded w-[240px] h-[40px]'
        value={cropId}
        onChange={(e) => setCropId(e.target.value)}
        placeholder='Crop ID'
      />
      <button className='bg-purple-500 text-white px-4 py-2 rounded' onClick={fetchCropDetails}>
        Fetch Details
      </button>
      {cropDetails && (
        <div className='mt-4'>
          <p>Seller: {cropDetails.seller}</p>
          <p>Crop Name: {cropDetails.cropName}</p>
          <p>Price per Unit: {ethers.utils.formatUnits(cropDetails.pricePerUnit, 'ether')} ETH</p>
          <p>Available Units: {cropDetails.availableUnits}</p>
          <p>Is Available: {cropDetails.isAvailable ? 'Yes' : 'No'}</p>
        </div>
      )}
    </div>
  );
};

export default CropDetails;
