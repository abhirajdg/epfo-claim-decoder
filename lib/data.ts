import usersData from '../data/users.json';
import claimsData from '../data/claims.json';
import rejectionData from '../data/rejection-codes.json';
import nudgeData from '../data/nudge-templates.json';

export const users = Object.fromEntries(usersData.users.map(user => [user.uan, user]));

export const claims = Object.fromEntries(
  claimsData.claims.map(claim => [
    claim.claimId,
    {
      id: claim.claimId,
      uan: claim.uan,
      type: claim.claimType,
      amount: new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(claim.amountClaimed),
      amountClaimed: claim.amountClaimed,
      rejectionCode: claim.rejectionCode,
      status: claim.status,
      history: claim.statusHistory,
      actor: rejectionData.codes.find(code => code.code === claim.rejectionCode)?.actor ?? 'self',
      onFixAction: claim.onFixAction,
    },
  ]),
);

export const codes = Object.fromEntries(
  rejectionData.codes.map(code => [
    code.code,
    {
      ...code,
      turnaround: code.typicalTurnaround,
    },
  ]),
);

export const nudgeTemplates = nudgeData.templates;
export const demoOtp = usersData.demoOtp;

export function byUan(uan: string) {
  return Object.values(claims).filter(claim => claim.uan === uan);
}

export function getUserForClaim(claimId: string) {
  const claim = claims[claimId as keyof typeof claims];
  return claim ? users[claim.uan] : undefined;
}
