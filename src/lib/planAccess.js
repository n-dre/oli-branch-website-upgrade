const PLAN_LEVEL = {
  lite: 1,
  assist: 2,
  oversight: 3,
  pro: 4,
};

export function canAccess(userPlanKey, requiredPlanKey) {
  const userLevel = PLAN_LEVEL[userPlanKey] || 0;
  const requiredLevel = PLAN_LEVEL[requiredPlanKey] || 999;
  return userLevel >= requiredLevel;
}
