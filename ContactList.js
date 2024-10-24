import React, { useState } from 'react';
import { View, Text, TextInput, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ContactList = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');

  // Sample contacts data
  const contacts = [
    { name: 'Vishwajeet', phone: '8010188055', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Vipin', phone: '9696304749', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Nikhil', phone: '8970225254', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Anirudh', phone: '9136754076', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Saurabh', phone: '9136754076', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Bachav', phone: '9136754076', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Palash', phone: '9136754076', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
    { name: 'Black', phone: '9136754076', imageUrl: 'https://www.shutterstock.com/image-photo/smiling-dog-happy-expression-face-600nw-2480072751.jpg' },
  ];

  // Filter contacts based on search query
  const filteredContacts = contacts.filter(contact =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Find contact"
            placeholderTextColor="#4e7397"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Display filtered contacts */}
        {filteredContacts.map((contact, index) => (
          <TouchableOpacity key={index} onPress={() => navigation.navigate('ContactScreen', { name: contact.name, phone: contact.phone })}>
            <ContactItem name={contact.name} phone={contact.phone} imageUrl={contact.imageUrl} />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Circular Add Contact Button */}
      <TouchableOpacity style={styles.addContactButton}>
        <Text style={styles.addContactButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const ContactItem = ({ name, phone, imageUrl }) => {
  return (
    <View style={styles.contactItem}>
      <Image
        source={{ uri: imageUrl }}
        style={styles.contactImage}
      />
      <View>
        <Text style={styles.contactName}>{name}</Text>
        <Text style={styles.contactPhone}>{phone}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  searchInput: {
    backgroundColor: '#e7edf3',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#0e141b',
  },
  addContactButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#4e7397',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Adds shadow on Android
    shadowColor: '#000', // iOS shadow color
    shadowOffset: { width: 0, height: 2 }, // iOS shadow offset
    shadowOpacity: 0.2, // iOS shadow opacity
    shadowRadius: 2, // iOS shadow radius
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  contactImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0e141b',
  },
  contactPhone: {
    fontSize: 14,
    color: '#4e7397',
  },
});

export default ContactList;
