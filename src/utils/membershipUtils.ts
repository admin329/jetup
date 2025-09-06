export interface DiscountInfo {
  canUseDiscount: boolean;
  discountPercentage: number;
  remainingDiscounts: number;
  operatorName?: string;
  totalDiscountsUsed?: number;
  remainingTotalDiscounts?: number;
}

export const getDiscountInfo = (user: any, operatorName?: string): DiscountInfo => {
  if (!user || user.role !== 'customer') {
    return {
      canUseDiscount: false,
      discountPercentage: 0,
      remainingDiscounts: 0,
      operatorName
    };
  }

  // Combined discount system: 2 per operator + 20 total limit
  const operatorDiscountLimit = 2;
  const totalDiscountLimit = 20;
  const operatorDiscountUsage = user.operatorDiscountUsage || user.discountUsage || {};
  const usedDiscountsForOperator = operatorName ? (operatorDiscountUsage[operatorName] || 0) : 0;
  const remainingDiscounts = Math.max(0, operatorDiscountLimit - usedDiscountsForOperator);

  // Calculate total discounts used across all operators
  const totalDiscountsUsed = Object.values(operatorDiscountUsage).reduce((sum: number, count: number) => sum + count, 0);
  const remainingTotalDiscounts = Math.max(0, totalDiscountLimit - totalDiscountsUsed);

  // Check if user can use discount (both per-operator and total limits)
  const canUseDiscount = operatorName && remainingDiscounts > 0 && remainingTotalDiscounts > 0 &&
                        (user.membershipType === 'standard' || user.membershipType === 'premium') &&
                        user.membershipType !== 'basic'; // Basic members cannot use discounts

  // Get discount percentage based on membership
  let discountPercentage = 0;
  if (user.membershipType === 'standard') {
    discountPercentage = 5;
  } else if (user.membershipType === 'premium') {
    discountPercentage = 10;
  }

  return {
    canUseDiscount,
    discountPercentage,
    remainingDiscounts,
    operatorName,
    totalDiscountsUsed,
    remainingTotalDiscounts
  };
}