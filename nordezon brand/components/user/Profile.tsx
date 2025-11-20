import { primaryOrange } from '@/constants/colors'
import { Ionicons } from '@expo/vector-icons'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'

const dummyUser = {
  fullname: 'John Doe',
  email: 'john.doe@email.com',
  city: 'New York',
  address: '1234, Fifth Avenue, Manhattan, NY 10001',
  avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
  interestCategories: ['Streetwear', 'Tech', 'Decor', 'Fitness'],
}

const Profile = () => {
  return (
    <View style={styles.container}>
      {/* Profile Avatar and Edit Button Row */}
      <View style={styles.row}>
        <Image
          source={{ uri: dummyUser.avatar }}
          style={styles.avatar}
        />
        <TouchableOpacity style={styles.editBtn}>
          <Ionicons name="create-outline" size={18} color="#fff" style={styles.editIcon} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Details */}
      <View style={styles.detailBlock}>
        <Text style={styles.label}>Full Name</Text>
        <Text style={styles.value}>{dummyUser.fullname}</Text>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{dummyUser.email}</Text>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.label}>City</Text>
        <Text style={styles.value}>{dummyUser.city}</Text>
      </View>
      <View style={styles.detailBlock}>
        <Text style={styles.label}>Address</Text>
        <Text style={styles.value}>{dummyUser.address}</Text>
      </View>
      
      {/* My Interest Categories */}
      <View style={styles.detailBlock}>
        <Text style={styles.label}>My Interest Categories</Text>
        <View style={styles.categoryList}>
          {dummyUser.interestCategories.map((cat, idx) => (
            <View key={cat + idx} style={styles.categoryChip}>
              <Text style={styles.categoryChipText}>{cat}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 24,
    borderWidth: 2,
    borderColor: primaryOrange,
    backgroundColor: '#eee'
  },
  editBtn: {
    backgroundColor: primaryOrange,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 30,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  },
  editIcon: {
    marginRight: 8,
  },
  detailBlock: {
    marginBottom: 20
  },
  label: {
    color: primaryOrange,
    fontSize: 13,
    fontWeight: '700'
  },
  value: {
    color: '#222',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 4
  },
  categoryList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8
  },
  categoryChip: {
    backgroundColor: primaryOrange,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    marginRight: 10,
    marginBottom: 8
  },
  categoryChipText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
    letterSpacing: 0.2
  }
})

export default Profile