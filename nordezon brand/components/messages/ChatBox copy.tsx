import CText from '@/components/common/CText';
import { primaryOrange } from '@/constants/colors';
import { formatDate } from '@/helpers';
import React, { useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import Product from '../brands/Product';

interface Product {
    id: string;
    name: string;
    sku: string;
    price: string;
    image?: any;
}

interface Message {
    id: string;
    text?: string;
    image?: string;
    product?: Product;  // NEW
    sender: 'user' | 'brand';
    time: string;
}


// Add an image to one of the messages
const initialMessages: Message[] = [
    { id: '1123', text: 'Hello! How can I help you today?', sender: 'brand', time: '10:00 AM' },
    { id: '22121', text: 'I wanted to know more about your latest collection.', sender: 'user', time: '10:02 AM' },
    { id: '123', text: 'Sure! We have some amazing new arrivals.', sender: 'brand', time: '10:05 AM' },
    { id: '423', text: 'Can you show me the summer collection?', sender: 'user', time: '10:06 AM' },
    { id: '5234', text: 'Absolutely! We have vibrant colors and patterns this season.', sender: 'brand', time: '10:07 AM' },
    { id: '622', text: 'Do you have sizes available for adults and kids?', sender: 'user', time: '10:09 AM' },
    { id: '722', text: 'Yes, all sizes are available.', sender: 'brand', time: '10:10 AM' },
    { id: '8222', text: 'What are the delivery options?', sender: 'user', time: '10:12 AM' },
    { id: '922', text: 'We offer standard and express delivery.', sender: 'brand', time: '10:13 AM' },
    { id: '120', text: 'Great! How long does express delivery take?', sender: 'user', time: '10:15 AM' },
    { id: '121', text: 'Usually 1-2 business days.', sender: 'brand', time: '10:16 AM' },
    { id: '1222', text: 'Is there a discount on bulk orders?', sender: 'user', time: '10:18 AM' },
    { id: '1223', text: 'Yes, we offer 10% off for orders above 50 items.', sender: 'brand', time: '10:19 AM' },
    { id: '124', text: 'That’s perfect. Can I see the catalog?', sender: 'user', time: '10:21 AM' },
    { id: '125', text: 'Sure, I will send you the PDF link.', sender: 'brand', time: '10:22 AM' },
    { id: '162', text: 'Thanks! How about payment options?', sender: 'user', time: '10:24 AM' },
    { id: '17', text: 'We accept all major credit cards and PayPal.', sender: 'brand', time: '10:25 AM' },
    { id: '128', text: 'Can I pay on delivery?', sender: 'user', time: '10:27 AM' },
    { id: '129', text: 'Yes, cash on delivery is available for local orders.', sender: 'brand', time: '10:28 AM' },
    { id: '220', text: 'Do you provide gift wrapping?', sender: 'user', time: '10:30 AM' },
    { id: '221', text: 'Yes, we offer premium gift wrapping options.', sender: 'brand', time: '10:31 AM' },
    { id: '222', text: 'How do I track my order?', sender: 'user', time: '10:33 AM' },
    { id: '223', text: 'We will provide a tracking number once shipped.', sender: 'brand', time: '10:34 AM' },
    { id: '224', text: 'Can I return items if needed?', sender: 'user', time: '10:36 AM' },
    { id: '225', text: 'Yes, we have a 14-day return policy.', sender: 'brand', time: '10:37 AM' },
    { id: '2226', text: 'Do you offer customization?', sender: 'user', time: '10:39 AM' },
    { id: '22272', text: 'Yes, we can customize prints and embroidery.', sender: 'brand', time: '10:40 AM' },
    { id: '228', text: 'That sounds great. Can I place a sample order?', sender: 'user', time: '10:42 AM' },
    { id: '2229', text: 'Absolutely, small sample orders are welcome.', sender: 'brand', time: '10:43 AM' },
    { id: '234234234234', image: 'file:///data/user/0/host.exp.exponent/cache/ImagePicker/c3068b91-7185-454a-9677-27785d0960bd.jpeg', sender: 'brand', time: '10:05 AM' },
    { id: '555555', text: 'Faizan', sender: 'user', time: '10:45 AM' },
    {
        id: '12234231212121',
        sender: 'user',
        time: '10:06 AM',
        product: {
            id: 'P-1001',
            name: 'Summer Floral Dress',
            sku: 'SKU-54321',
            price: 'Rs. 2450',
        },
    },
];


interface ChatBoxProps {
    navigation?: any;
    chatName?: string;
    chatAvatar?: any;
}

const ChatBox = ({
    navigation,
    chatName = 'Farokht',
    chatAvatar = require('../../assets/images/brand/logo.png'),
}: ChatBoxProps) => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const { chatMessages } = useSelector((state: any) => state.chat)
    const { user } = useSelector((state: any) => state.user)
    return (
        <View style={styles.outerContainer}>
            <View style={styles.messagesContainer}>
                {chatMessages.map((item: any) => {
                    const isUser = user.id == item?.messages?.userId;
                    return (
                        <View
                            key={item.id}
                            style={[styles.messageContainer, isUser ? styles.userMessage : styles.brandMessage, {
                                backgroundColor: !item.product && isUser ? primaryOrange : item.product ? '#f3f7f9' : '#e6e5e4',
                            }]}
                        >
                            {item.messages &&
                                <CText style={[styles.messageText, { color: isUser ? '#fff' : '#000' }]}>
                                    {item.messages.messageBody}
                                </CText>
                            }

                            {item.image && (
                                <Image
                                    source={{ uri: item.image }}
                                    style={styles.messageImage}
                                    resizeMode="cover"
                                />
                            )}
                            {/* Product */}
                            {item.product && (
                                <Product item={item.product} overlayButtons={false} />
                            )}
                            {
                                !item.product && (

                                    <CText style={[styles.timeText, { color: isUser ? '#fff' : '#555' }]}>
                                        {formatDate(item.sentAt)}
                                    </CText>
                                )
                            }
                        </View>
                    );
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    outerContainer: {
        flex: 1,
    },
    messagesContainer: {
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    messageContainer: {
        maxWidth: '75%',
        padding: 10,
        borderRadius: 12,
        marginVertical: 4,
    },
    userMessage: {
        alignSelf: 'flex-end',
        borderTopRightRadius: 0,
    },
    brandMessage: {
        alignSelf: 'flex-start',
        borderTopLeftRadius: 0,
    },
    messageText: {
        fontSize: 14,
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 8,
        marginTop: 6,
        marginBottom: 4,
    },
    timeText: {
        fontSize: 10,
        marginTop: 2,
        textAlign: 'right',
    },
});

export default ChatBox;
