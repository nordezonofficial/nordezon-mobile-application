import { primaryGreen, primaryOrange } from '@/constants/colors';
import {
    getOrderStatuses,
    statusToObj
} from "@/constants/status";
import { formatDateAndTime, getStatusColor } from '@/helpers';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { useSelector } from 'react-redux';


const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Only one logo fallback for vendors with no logo
const VENDOR_LOGOS: any = {
    Default: 'https://i.ibb.co/R3QvGhJ/storefront.png',
};







// Utility: At least 2 steps per line (centered, fixed width per item, always)
const chunkAtLeast = (arr: any[], size: number) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    // Special: if last chunk is 1 and previous exists, merge last two
    if (result.length > 1 && result[result.length - 1].length === 1) {
        const last = result.pop();
        result[result.length - 1] = result[result.length - 1].concat(last);
    }
    return result;
};

// Multi-line horizontal progress bar: at least 2 per row, always centered, all steps same width as before
const HorizontalProgressBar = ({
    status,
    updatedAts = {}
}: {
    status: string;
    updatedAts?: any;
}) => {
    // Only show Cancelled status if it's a cancelled order
    // Otherwise show base statuses, omitting 'COMPLETED'
    const steps = getOrderStatuses(status);

    const currentIdx = steps.findIndex(s => s.key === (status || '').toString().toUpperCase());
    const STEPS_PER_LINE = 2;

    // Chunk into at least 2 steps per line
    const lines = chunkAtLeast(steps, STEPS_PER_LINE);

    // For width: keep same as previous code, calculate for 3 per row, keep fixed always
    const STEP_WIDTH = Math.floor((SCREEN_WIDTH - 32 - 12) / 3); // intentionally 3, not 2
    const fixedStepWidth = STEP_WIDTH < 70 ? 80 : STEP_WIDTH;

    // For description lookups: get the correct list depending on status
    const allDescriptions = getOrderStatuses(status).reduce((map, obj) => {
        map[obj.key] = obj.description;
        return map;
    }, {} as Record<string, string>);

    return (
        <View style={styles.horizontalProgressWrapperCentered}>
            {lines.map((line, lineIdx) => {
                const isLastLine = lineIdx === lines.length - 1;
                const emptySlots = line.length < STEPS_PER_LINE ? STEPS_PER_LINE - line.length : 0;

                return (
                    <View key={`line_${lineIdx}`} style={styles.horizontalStepsRowMultiCentered}>
                        {/* Add left spacer if our last row is less than STEPS_PER_LINE */}
                        {emptySlots > 0 && (
                            <View style={{ width: (fixedStepWidth + 24) / 2 * emptySlots }} />
                        )}
                        {line.map((step, idx) => {
                            const stepGlobalIdx = lineIdx * STEPS_PER_LINE + idx;
                            const completed = stepGlobalIdx < currentIdx;
                            const active = stepGlobalIdx === currentIdx;
                            const stepColor = getStatusColor(step.key);

                            return (
                                <React.Fragment key={step.key}>
                                    <View style={[styles.horizontalStepItem, { minWidth: fixedStepWidth, maxWidth: fixedStepWidth }]}>
                                        <View
                                            style={[
                                                styles.progressDotHorz,
                                                completed && { backgroundColor: stepColor },
                                                active && { backgroundColor: '#fff', borderWidth: 2, borderColor: stepColor },
                                            ]}
                                        >
                                            <Ionicons
                                                name={step.icon as any}
                                                size={17}
                                                color={active ? stepColor : completed ? '#fff' : '#888'}
                                            />
                                        </View>
                                        {/* Step label */}
                                        <Text
                                            style={[
                                                styles.statusStepTextHorz,
                                                active
                                                    ? { color: stepColor }
                                                    : completed
                                                        ? { color: stepColor, opacity: 0.85 }
                                                        : { color: '#888' },
                                            ]}
                                        >
                                            {step.label}
                                        </Text>
                                        {/* Date/time */}
                                        {(active && step.key !== 'PENDING' && updatedAts?.[step.key]) && (
                                            <Text style={styles.statusStepCaptionHorz}>
                                                {formatDateAndTime(updatedAts[step.key])}
                                            </Text>
                                        )}
                                        {/* Description (always tiny) */}
                                        <Text style={styles.statusStepDescriptionHorz}>
                                            {allDescriptions[step.key] || ''}
                                        </Text>
                                    </View>
                                    {/* Line connector */}
                                    {idx < line.length - 1 && (
                                        <View
                                            style={[
                                                styles.horizontalBar,
                                                completed && { backgroundColor: stepColor },
                                            ]}
                                        />
                                    )}
                                </React.Fragment>
                            );
                        })}
                        {/* Add right spacer if needed for centering */}
                        {emptySlots > 0 && (
                            <View style={{ width: (fixedStepWidth + 24) / 2 * emptySlots }} />
                        )}
                    </View>
                );
            })}
        </View>
    );
};

// Add a verified badge component for clarity. Use Ionicons "checkmark-circle" for badge.
const VerifiedBadge = () => (
    <Ionicons name="checkmark-circle" size={17} color={primaryGreen} />
);

const OrderTrackItem = () => {
    const { orderTracking } = useSelector((state: any) => state.order);

    // Order group with all vendor sub orders
    const orders = Array.isArray(orderTracking?.orders) ? orderTracking.orders : [];

    // State for each vendor card, store expanded status by VendorOrderId
    const [expandedTrackingIds, setExpandedTrackingIds] = useState<{ [key: string]: boolean }>({});

    if (!orders.length) {
        return (
            <View style={{ padding: 18 }}>
                <Text style={{ color: '#666', fontSize: 16 }}>No tracking info available yet.</Text>
            </View>
        );
    }

    const toggleExpanded = (id: string) => {
        setExpandedTrackingIds(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 60 }}
        >
            {orders.map((vendorOrder: any) => {
                // vendor info (brand and logo)
                const vendorBrand = vendorOrder.user?.brand || 'Vendor';
                const vendorLogo =
                    vendorOrder.user?.logoUrl?.trim() !== ''
                        ? vendorOrder.user.logoUrl
                        : VENDOR_LOGOS.Default;
                const isApproved = !!vendorOrder.user?.isApprovedByLawyer;

                const statusObj = statusToObj(vendorOrder.status);

                // Only use statuses relevant to this order's status (cancelled or base)
                const updatedAts =
                    vendorOrder.trackingHistory && typeof vendorOrder.trackingHistory === 'object'
                        ? vendorOrder.trackingHistory
                        : { [statusObj.key]: vendorOrder.updatedAt };

                const isExpanded = !!expandedTrackingIds[vendorOrder.id];

                return (
                    <View
                        key={vendorOrder.id}
                        style={[
                            styles.vendorCardShadowWrap,
                            {
                                backgroundColor: '#fff',
                                borderWidth: 1,
                                borderColor: '#eee',
                                marginBottom: 21,
                            },
                        ]}
                    >
                        <View style={[styles.vendorCard, { backgroundColor: '#fff', flexDirection: 'column' }]}>

                            <View style={{ flex: 1 }}>
                                <View style={styles.vendorHeader}>
                                    <View style={styles.row}>
                                        <Image
                                            source={{ uri: vendorLogo }}
                                            style={styles.vendorLogo}
                                            resizeMode="contain"
                                        />
                                        <Text style={[styles.vendorName, { color: '#222' }]}>
                                            {vendorBrand}
                                        </Text>
                                        {
                                            isApproved && <VerifiedBadge />
                                        }
                                    </View>
                                    <View
                                        style={[
                                            styles.vendorStatusBadge,
                                            {
                                                backgroundColor: statusObj.color + '22',
                                                borderColor: statusObj.color,
                                            },
                                        ]}
                                    >
                                        <Ionicons
                                            name={statusObj.icon as any}
                                            size={16}
                                            color={statusObj.color}
                                            style={{ marginRight: 5 }}
                                        />
                                        <Text style={[styles.statusText, { color: statusObj.color }]}>
                                            {statusObj.label}
                                        </Text>
                                    </View>
                                </View>

                                <View>
                                    {(Array.isArray(vendorOrder.items) ? vendorOrder.items : []).map((orderItem: any) => {
                                        const itemName = orderItem.post?.title || 'Item';
                                        const itemImage = orderItem.post?.url || VENDOR_LOGOS.Default;
                                        return (
                                            <View key={orderItem.id} style={styles.itemRow}>
                                                <Image
                                                    source={{ uri: itemImage }}
                                                    style={styles.itemImage}
                                                    resizeMode="cover"
                                                />
                                                <View style={{ flex: 1, marginLeft: 13 }}>
                                                    <Text
                                                        style={[styles.itemName, { color: '#222' }]}
                                                        numberOfLines={1}
                                                    >
                                                        {itemName}
                                                    </Text>
                                                    <View
                                                        style={{
                                                            flexDirection: 'row',
                                                            alignItems: 'center',
                                                            marginTop: 2,
                                                        }}
                                                    >
                                                        <Text style={styles.itemQtyText}>
                                                            Qty: {orderItem.qty}
                                                        </Text>
                                                        <Text style={[styles.itemPrice, { color: primaryOrange }]}>
                                                            Rs. {orderItem.price}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            </View>

                            {/* Toggle tracking progress bar button */}
                            <TouchableOpacity
                                onPress={() => toggleExpanded(vendorOrder.id)}
                                style={{
                                    paddingTop: 5,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    alignSelf: 'flex-start',
                                    marginBottom: 5,
                                    marginTop: 1,
                                    paddingHorizontal: 5,
                                    borderRadius: 8,
                                }}
                            >
                                <Text style={{
                                    color: '#007AFF',
                                    fontSize: 13,
                                    fontFamily: 'PoppinsMedium',
                                }}>
                                    {isExpanded ? 'Hide Tracking' : 'Show Tracking'}
                                </Text>
                                <Ionicons
                                    name={isExpanded ? 'chevron-up-outline' : 'chevron-down-outline'}
                                    size={17}
                                    color="#007AFF"
                                    style={{ marginLeft: 3 }}
                                />
                            </TouchableOpacity>
                            {/* Tracking progress bar as horizontal, outside the item row, in its own line */}
                            {isExpanded ? (
                                <HorizontalProgressBar status={vendorOrder.status} updatedAts={updatedAts} />
                            ) : null}
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center' },
    statusText: {
        fontFamily: 'PoppinsMedium',
        fontSize: 15,
        marginLeft: 1,
        letterSpacing: 0.2,
    },
    vendorCardShadowWrap: {
        marginBottom: 18,
        borderRadius: 15,
        overflow: 'visible',
        shadowColor: '#fafafa',
        shadowOpacity: 0.09,
        shadowRadius: 7,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
        backgroundColor: '#fff',
    },
    vendorCard: {
        borderRadius: 13,
        paddingHorizontal: 15,
        paddingTop: 15,
        paddingBottom: 10,
        backgroundColor: '#fff',
        shadowColor: '#888',
        shadowOpacity: 0.07,
        shadowRadius: 6,
        flex: 1,
        flexDirection: 'column', // now vertical to allow tracking bar on separate line
    },
    vendorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
        marginTop: -1,
    },
    vendorLogo: {
        width: 33,
        height: 33,
        borderRadius: 6,
        marginRight: 9,
        backgroundColor: '#faf7ef',
    },
    vendorName: {
        color: '#222',
        fontSize: 18,
        fontFamily: 'PoppinsSemiBold',
        letterSpacing: 0.1,
        marginRight: 8,
    },
    vendorStatusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 11,
        paddingVertical: 4,
        borderRadius: 16,
        alignSelf: 'flex-start',
        borderWidth: 1,
        marginLeft: 7,
        backgroundColor: '#fff',
    },
    verifiedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 6,
        paddingHorizontal: 7,
        paddingVertical: 2,
        backgroundColor: '#eafcf1',
        borderRadius: 11,
    },
    verifiedBadgeText: {
        color: '#31ba57',
        fontFamily: 'PoppinsMedium',
        fontSize: 13,
        marginLeft: 3,
    },
    // Adjusted horizontalProgressWrapper for centering
    horizontalProgressWrapperCentered: {
        flexDirection: 'column',
        alignItems: 'center',
        flexWrap: "wrap",
        justifyContent: 'center',
        marginBottom: 13,
        marginTop: 2,
        paddingTop: 5,
        minHeight: 60,
        overflow: 'visible',
        paddingRight: 0,
    },
    // New style for multi-line steps row (centered version)
    horizontalStepsRowMultiCentered: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        minHeight: 50,
        marginBottom: 8,
        width: '100%',
    },
    // For reference: not used anymore
    horizontalStepsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'nowrap',
        minHeight: 50,
    },
    horizontalStepItem: {
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 44,
        paddingHorizontal: 3,
        flexShrink: 1,
        maxWidth: 80,
        backgroundColor: "#fff",
    },
    progressDotHorz: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: '#ececec',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        marginBottom: 1,
        zIndex: 3,
    },
    horizontalBar: {
        height: 4,
        width: 22,
        backgroundColor: '#f1f1f1',
        marginHorizontal: 2,
        alignSelf: 'center',
        borderRadius: 2,
        zIndex: 2,
        marginBottom: 8,
    },
    statusStepTextHorz: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 13,
        marginTop: 2,
        marginBottom: 0,
        textAlign: 'center',
        maxWidth: 75,
    },
    statusStepCaptionHorz: {
        fontFamily: 'PoppinsRegular',
        color: '#656666',
        fontSize: 9,
        marginTop: 1,
        marginBottom: 0,
        textAlign: 'center',
        maxWidth: 100,
    },
    statusStepDescriptionHorz: {
        fontFamily: 'PoppinsRegular',
        color: '#b2b2b2',
        fontSize: 8,
        fontStyle: 'italic',
        marginTop: 0,
        minHeight: 14,
        textAlign: 'center',
        maxWidth: 75,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        borderBottomColor: '#efefef',
        borderBottomWidth: 1,
        marginBottom: 2,
    },
    itemImage: {
        width: 56,
        height: 56,
        borderRadius: 8,
        backgroundColor: '#faf7ef',
    },
    itemName: {
        color: '#222',
        fontSize: 16,
        fontFamily: 'PoppinsMedium',
        marginBottom: 3,
        marginTop: 2,
        maxWidth: SCREEN_WIDTH * 0.42,
    },
    itemQtyText: {
        color: '#888',
        fontSize: 13,
        marginRight: 12,
        fontFamily: 'PoppinsRegular',
    },
    itemPrice: {
        color: primaryOrange,
        fontFamily: 'PoppinsSemiBold',
        fontSize: 15,
        marginLeft: 9,
    },
    // Old vertical progress - NOT USED now, kept for code reference
    verticalProgressOuter: {
        width: 56,
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
        paddingTop: 8,
        paddingBottom: 2,
        minHeight: 10,
    },
    verticalProgressWrapper: {
        flexDirection: 'column',
        alignItems: 'center',
        width: 56,
        flex: 1,
    },
    verticalStepWrap: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: 46,
    },
    verticalIndicatorWrap: {
        alignItems: 'center',
        width: 32,
        minHeight: 42,
    },
    progressDotVert: {
        width: 26,
        height: 26,
        borderRadius: 15,
        backgroundColor: '#ececec',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
        zIndex: 3,
    },
    verticalBar: {
        width: 5,
        height: 34,
        backgroundColor: '#f1f1f1',
        marginTop: 0,
        marginBottom: 0,
        borderRadius: 2,
        alignSelf: 'center',
        zIndex: 2,
    },
    verticalLabelText: {
        marginLeft: 7,
        minHeight: 38,
        flex: 1,
        paddingTop: 1,
    },
    statusStepText: {
        fontFamily: 'PoppinsSemiBold',
        fontSize: 15,
        marginBottom: 0,
        marginTop: 0,
    },
    statusStepCaption: {
        fontFamily: 'PoppinsRegular',
        color: '#656666',
        fontSize: 10,
        marginTop: 0,
        marginBottom: 1,
    },
    statusStepDescription: {
        fontFamily: 'PoppinsRegular',
        color: '#999',
        fontSize: 10,
        fontStyle: 'italic',
        marginTop: 0,
    },
});

export default OrderTrackItem;