(function () {
    /**
     * Add hook
     */
    const originalCheckButtons = checkButtons;
    checkButtons = function (what) {
        originalCheckButtons(what);

        if (what == 'equipment') {
            markBestEquipmentDeals();
        } else if (what == 'buildings') {
            markBestHousingDeal();
        }
    }

    /**
     * Find and mark best housing deal
     * Calculated by ratio of costliest material to Trimp increase, thereby seeing all materials to be equal in worth
     */
    function markBestHousingDeal() {
        const bestHousing = findBestHousingDeal();

        const nodes = document.querySelectorAll('#buildingsHere .thing');

        for (let node of nodes) {
            let isBest = false;
            let bgColor = "";
            let textColor = "";

            if (node.id == bestHousing) {
                isBest = true;
                bgColor = "#36906a";
            }

            if (isBest && node.classList.contains('thingColorCanNotAfford')) {
                textColor = "black";
            }

            node.style.background = bgColor;
            node.style.color = textColor;
        }
    }

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


    /**
     * Find and mark best equipment deals
     * Calculated by ratio of metal cost to attack or health increase respectively
     */
    function markBestEquipmentDeals() {
        const bestHealth = findBestHealthDeal();
        const bestAttack = findBestAttackDeal();

        const nodes = document.querySelectorAll('#equipmentHere .thing');

        for (let node of nodes) {
            let isBest = false;
            let bgColor = "";
            let textColor = "";

            if (node.id == bestHealth) {
                isBest = true;
                bgColor = "#4b94b3";
            } else if (node.id == bestAttack) {
                isBest = true;
                bgColor = "#9a5e6d";
            }

            if (isBest && node.classList.contains('thingColorCanNotAfford')) {
                textColor = "black";
            }

            node.style.background = bgColor;
            node.style.color = textColor;
        }
    }

    function findBestHealthDeal() {
        const healthItems = ['Boots', 'Helmet', 'Pants', 'Shoulderguards', 'Breastplate'];
        const healthFactor = 'healthCalculated';

        return findBestEquipmentDeal(healthItems, healthFactor);
    }

    function findBestAttackDeal() {
        const attackItems = ['Dagger', 'Mace', 'Polearm', 'Battleaxe', 'Greatsword'];
        const attackFactor = 'attackCalculated';

        return findBestEquipmentDeal(attackItems, attackFactor);
    }

    function findBestEquipmentDeal(items, scoreFactor) {
        const costItem = 'metal';
        let currentBest = {};

        for (let item of items) {
            let what = game.equipment[item];
            let price = parseFloat(getBuildingItemPrice(what, costItem, true, 1));
            let health = what[scoreFactor];

            let ratio = health / price;

            if (!currentBest.ratio || currentBest.ratio < ratio) {
                currentBest.item = item;
                currentBest.ratio = ratio;
            }
        }

        return currentBest.item;
    }
})();

