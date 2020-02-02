import { Shared, State, Voting } from "@arkecosystem/core-interfaces";
import { Utils } from "@arkecosystem/crypto";

export class VotingManager implements Voting.ISystem {
    private walletManager: State.IWalletManager;

    constructor() {}

    public init(walletManager: State.IWalletManager) {
        this.walletManager = walletManager;
    }

    calculateRanks(roundInfo?: Shared.IRoundInfo): State.IWallet[] {
        const delegatesActive: State.IWallet[] = [];

        for (const delegate of this.walletManager.allByUsername()) {
            if (delegate.hasAttribute("delegate.resigned")) {
                delegate.forgetAttribute("delegate.rank");
            } else {
                delegatesActive.push(delegate);
            }
        }

        let delegatesSorted = delegatesActive
            .sort((a, b) => {
                const voteBalanceA: Utils.BigNumber = a.getAttribute("delegate.voteBalance");
                const voteBalanceB: Utils.BigNumber = b.getAttribute("delegate.voteBalance");

                const diff = voteBalanceB.comparedTo(voteBalanceA);
                if (diff === 0) {
                    if (a.publicKey === b.publicKey) {
                        throw new Error(
                            `The balance and public key of both delegates are identical! Delegate "${a.getAttribute(
                                "delegate.username",
                            )}" appears twice in the list.`,
                        );
                    }

                    return a.publicKey.localeCompare(b.publicKey, "en");
                }

                return diff;
            })
            .map(
                (delegate, i): State.IWallet => {
                    const rank = i + 1;
                    delegate.setAttribute("delegate.rank", rank);
                    return delegate;
                },
            );

        if (roundInfo) {
            delegatesSorted = delegatesSorted.slice(0, roundInfo.maxDelegates);
            for (const delegate of delegatesSorted) {
                delegate.setAttribute("delegate.round", roundInfo.round);
            }
        }

        return delegatesSorted;
    }
    calculateStakes(): void {
        for (const voter of this.walletManager.allByPublicKey()) {
            if (voter.hasVoted()) {
                const delegate: State.IWallet = this.walletManager.findByPublicKey(voter.getAttribute<string>("vote"));
                const voteBalance: Utils.BigNumber = delegate.getAttribute("delegate.voteBalance");
                const lockedBalance = voter.getAttribute("htlc.lockedBalance", Utils.BigNumber.ZERO);
                delegate.setAttribute("delegate.voteBalance", voteBalance.plus(voter.balance).plus(lockedBalance));
            }
        }
    }
    getRankedDelegates(): State.IWallet[] {
        return this.calculateRanks();
    }
    getForgerDelegates(): State.IWallet[] {
        throw new Error("Method not implemented.");
    }
}
