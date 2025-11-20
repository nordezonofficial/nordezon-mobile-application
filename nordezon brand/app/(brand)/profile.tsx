import BrandEProfile from '@/components/brands/BrandEProfile';
import BackgroundContainer from '@/components/common/BackgroundContainer';
import React from 'react';



const profile = () => {
    return (
        <BackgroundContainer paddingVertical={0} paddingHorizontal={0}>
            <BrandEProfile
                logo={require('../../assets/images/brand/logo.png')}
                banner={require('../../assets/images/brand/banner.webp')}
                name="Khaadi Official"
                bio="Official page of Khaadi. Discover latest collections and updates."
                verified
                onEditPress={() => console.log('Edit Pressed')}
                details={{
                    fullName: 'John Doe',
                    email: 'johndoe@gmail.com',
                    contactNumber: '+92 300 1234567',
                    city: 'Karachi',
                    address: '123 Main Street, Karachi, Pakistan',
                    cnic: '12345-6789012-3',
                    brandName: 'Khaadi',
                    businessType: 'Retail Fashion',
                    activeOn: 'Instagram, Facebook, Website',
                }}
            />
        </BackgroundContainer>
    );
};

export default profile;
