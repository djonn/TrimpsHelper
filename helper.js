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
     * Calculated by ratio of Trimp increase to how long it will take to get resources
     * Ratio only uses the resources that will take the longest to collect
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
        const buildings = ['Hut', 'House', 'Mansion', 'Hotel', 'Resort', 'Gateway', 'Wormhole', 'Collector', 'Warpstation'];
        let currentBest = {};

        for (let building of buildings) {
            let what = game.buildings[building];

            if (what.locked) continue;

            const costItems = Object.keys(what.cost);
            let longestWaitTime = 0;

            for (let costItem of costItems) {
                const costItemPerSec = getPsString(costItem, true);
                const price = parseFloat(getBuildingItemPrice(what, costItem, false, 1));
                const timeToEarn = price / costItemPerSec;

                if (timeToEarn > longestWaitTime) longestWaitTime = timeToEarn;
            }

            let increase = what.increase.by;
            let ratio = increase / longestWaitTime;

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
        const healthItems = ['Boots', 'Helmet', 'Pants', 'Shoulderguards', 'Breastplate', 'Gambeson'];
        const healthFactor = 'healthCalculated';

        return findBestEquipmentDeal(healthItems, healthFactor);
    }

    function findBestAttackDeal() {
        const attackItems = ['Dagger', 'Mace', 'Polearm', 'Battleaxe', 'Greatsword', 'Arbalest'];
        const attackFactor = 'attackCalculated';

        return findBestEquipmentDeal(attackItems, attackFactor);
    }

    function findBestEquipmentDeal(items, scoreFactor) {
        const costItem = 'metal';
        let currentBest = {};

        for (let item of items) {
            let what = game.equipment[item];

            if (what.locked) continue;

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

