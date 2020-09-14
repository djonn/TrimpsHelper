(function () {
    return findBestHousingDeal();

    /**
     * Calculated by ratio of costliest material to Trimp increase, thereby seeing all materials to be equal in worth
     */
    function findBestHousingDeal() {
        const buildings = ['Hut', 'House', 'Mansion'];
        const costItems = ['food', 'metal', 'wood'];
        let currentBest = {};

        for (let building of buildings) {
            let what = game.buildings[building];
            let costliestPrice = 0;

            for (let costItem of costItems) {
                if (!Object.keys(what.cost).includes(costItem)) continue;

                const price = parseFloat(getBuildingItemPrice(what, costItem, false, 1));
                if (price > costliestPrice) costliestPrice = price;
            }

            let increase = what.increase.by;

            let ratio = increase / costliestPrice;

            if (!currentBest.ratio || currentBest.ratio < ratio) {
                currentBest.building = building;
                currentBest.ratio = ratio;
            }
        }

        return currentBest.building;
    }
})();

