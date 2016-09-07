var drawsCalculator = {
    groups: [],
    draws: [],
    drawsKeysOnly: [],
    possibilities: {},
    teamGroups: {},
    teamPossGroups: {},
    init: function() {
        this.generatePossibleGroups();
        this.mixGroups();
        this.getDrawsWithKeysOnly();
    },
    getTeams: function() {
        return [
            {country: "lck",seed: "1",pool: "1", key: "ROX"},
            {country: "lck",seed: "2",pool: "2", key: "SKT"},
            {country: "lck",seed: "3",pool: "2", key: "SSG"},
            {country: "lpl",seed: "1",pool: "1", key: "EDG"},
            {country: "lpl",seed: "2",pool: "2", key: "RNG"},
            {country: "lpl",seed: "3",pool: "2", key: "IMAY"},
            {country: "na",seed: "1",pool: "1", key: "TSM"},
            {country: "na",seed: "2",pool: "2", key: "CLG"},
            {country: "na",seed: "3",pool: "3", key: "C9"},
            {country: "lms",seed: "1",pool: "1", key: "FW"},
            {country: "lms",seed: "2",pool: "2", key: "AHQ"},
            {country: "eu",seed: "1",pool: "2", key: "G2"},
            {country: "eu",seed: "2",pool: "2", key: "H2K"},
            {country: "eu",seed: "3",pool: "3", key: "SPY"},
            {country: "iwc",seed: "1",pool: "3", key: "INTZ"},
            {country: "iwc",seed: "2",pool: "3", key: "ANL"}
        ];
    },
    findTeam: function(key) {
        var teams = this.getTeams();
        for(var i in teams) {
            if(key == teams[i].key) {
                return teams[i];
            }
        }
    },
    getPool: function(i) {
        return _.filter(this.getTeams(), function(item) {
            return item.pool == i;
        });
    },
    generatePossibleGroups: function() {
        var result = [];
        var pool1 = this.getPool(1);
        var pool2 = this.getPool(2);
        var pool3 = this.getPool(3);

        for(var h = 0; h < pool1.length; h++) {
            var t0 = pool1[h];
            for(var i = 0; i < pool2.length; i++) {
                var t1 = pool2[i];
                if(t0.country != t1.country) {
                    for(var j = i; j < pool2.length; j++) {
                        var t2 = pool2[j];
                        if(t0.country != t2.country && t1.country != t2.country) {
                            for(var k = 0; k < pool3.length; k++) {
                                var t3 = pool3[k];
                                if(t0.country != t3.country && t1.country != t3.country && t2.country != t3.country) {
                                    var suggestion = [t0,t1,t2,t3];
                                    result.push(suggestion);
                                }
                            }
                        }
                    }
                }
            }
        }

        this.groups = result;
    },
    mixGroups: function() {
        var result = [];

        for(var i = 0; i < this.groups.length; i++) {
            var g1 = this.groups[i];
            for(var j = i; j < this.groups.length; j++) {
                var g2 = this.groups[j];
                if(this.checkGroups(g1,g2)) {
                    for(var k = j; k < this.groups.length; k++) {
                        var g3 = this.groups[k];
                        if(this.checkGroups(g1,g3) && this.checkGroups(g2,g3)) {
                            for(var l = k; l < this.groups.length; l++) {
                                var g4 = this.groups[l];
                                if(this.checkGroups(g1,g4) && this.checkGroups(g2,g4) && this.checkGroups(g3,g4)) {
                                    result.push([g1,g2,g3,g4]);
                                }
                            }
                        }
                    }
                }
            }
        }

        this.draws = result;
    },
    checkGroups: function (g1, g2) {
        for(var i = 0; i < g1.length; i++) {
            for(var j = 0; j < g2.length; j++) {
                if(g1[i].key == g2[j].key) {
                    return false;
                }
            }
        }

        return true;
    },
    getDrawsWithKeysOnly: function() {
        var that = this;
        for(k in this.draws) {
            var groups = this.draws[k];
            var set = [];
            for(o in groups) {
                var g = [];
                var group = groups[o];
                for(n in group) {
                    var team = group[n];
                    g.push(team.key);
                }
                set.push(g);
            };
            this.drawsKeysOnly.push(set);
        };

        for(var k = 0; k < this.drawsKeysOnly.length; k++) {
            var draw = this.drawsKeysOnly[k];
            for(var j = 0; j < 4; j++) {
                var group = draw[j];
                for(var i = 0; i < 4; i++) {
                    var teamKey = group[i];
                    if(typeof this.possibilities[teamKey] == "undefined") {
                        this.possibilities[teamKey] = {};
                        this.teamGroups[teamKey] = 0;
                        this.teamPossGroups[teamKey] = {};
                    }

                    if(typeof this.teamPossGroups[teamKey][this.getGroupKeyString(group)] == "undefined") {
                        this.teamPossGroups[teamKey][this.getGroupKeyString(group)] = 0;
                    }
                    this.teamPossGroups[teamKey][this.getGroupKeyString(group)]++;

                    this.teamGroups[teamKey]++;

                    for(var m = 0; m < 4; m++) {
                        if(m!=i) {
                            var t2 = group[m];
                            if(typeof this.possibilities[teamKey][t2] == "undefined") {
                                this.possibilities[teamKey][t2] = 0;
                            }
                            this.possibilities[teamKey][t2]++;
                        }
                    }
                }
            }
        }

        this.maxPossibility = 0;
        this.minPossibility = Infinity;

        for(var i in this.possibilities) {
            var teamPossibilities = this.possibilities[i];
            for(var j in teamPossibilities) {
                this.possibilities[i][j] = 100*this.possibilities[i][j]/this.teamGroups[i];
                this.maxPossibility = Math.max(this.maxPossibility, this.possibilities[i][j]);
                this.minPossibility = Math.min(this.minPossibility, this.possibilities[i][j]);
            }
        }

        var possibilitiesWrap = $('.p');

        var teams = this.getTeams();

        $('<div />').addClass('p-cell').appendTo(possibilitiesWrap).data({
            "row": 0,
            "column": 0
        });

        for(var i in teams) {
            var t1 = teams[i].key;
            var lD = $('<div />').addClass("logo-sm p-cell").html("<img src='img/" + t1.toLowerCase() + ".png' />").appendTo(possibilitiesWrap).data({
                "row": 0,
                "column": parseInt(i) + 1
            });
        }
        for(var i in teams) {
            var t1 = teams[i].key;
            var lD = $('<div />').addClass("logo-sm p-cell").html("<img src='img/" + t1.toLowerCase() + ".png' />").appendTo(possibilitiesWrap).data({
                "row": parseInt(i) + 1,
                "column": 0
            });
            for(var j in teams) {
                var t2 = teams[j].key;
                var d = $('<div />').css("background-color", "#dde3e7");
                if(typeof this.possibilities[t1][t2] != "undefined") {
                    d = $(color_code(this.possibilities[t1][t2], this.minPossibility, this.maxPossibility, "div", 189, 195, 199, 44, 62, 80, true)).append("%");
                }
                d.addClass("p-cell").appendTo(possibilitiesWrap).data({
                    "row": parseInt(i) + 1,
                    "column": parseInt(j) + 1
                });
            }
        }

        var cells = possibilitiesWrap.find(".p-cell");

        cells.on("mouseenter", function() {
            var row = $(this).data("row");
            var column = $(this).data("column");
            cells.removeClass('hover');
            var c = $(this);
            c.addClass("hover");
            cells.each(function() {
                if($(this).data("row") == row && $(this).data("column") == 0 || $(this).data("column") == column && $(this).data("row") == 0) {
                    $(this).addClass('hover');
                }
            });
        });
        cells.on("mouseleave", function() {
            cells.removeClass('hover');
        });

        cells.on("click", function() {
            var status = $(this).data("showing")
            cells.data("showing", false);
            var row = $(this).data("row");
            var column = $(this).data("column");
            if(!status) {
                $(this).data('showing', true);
                if(teams[row-1] && teams[column-1] && that.possibilities[teams[row-1].key][teams[column-1].key]) {
                    that.clearExtraInfo();
                    that.showExtraInfo(teams[row-1], teams[column-1]);
                }
            } else {
                $(this).data('showing', false);
                that.clearExtraInfo();
            }
        });
    },
    getGroupKeyString: function(g) {
        return g.join("_");
    },
    showExtraInfo: function(t1, t2) {
        $('.extra-info').html("");
        var w = $('.extra-info');
        var vsWrap = $('<div class="vs-wrap" />').appendTo(w);
        var vs1 = $('<div class="vs-team vs-team-1" />').appendTo(vsWrap).html("<span>(" + t1.key + ")</span><img src='img/" + t1.key.toLowerCase() + ".png'/>");
        var vsLabel = $('<div class="vs-label">vs</div>').appendTo(vsWrap);
        var vs2 = $('<div class="vs-team vs-team-2" />').appendTo(vsWrap).html("<img src='img/" + t2.key.toLowerCase() + ".png'/><span>(" + t2.key + ")</span>");

        var desc = $("<div class='extra-info-desc'/>").appendTo(w);
        var posWrap = $('<div class="extra-poss"/>').html("Chance to meet at group stage: <span>" + Math.round(100*this.possibilities[t1.key][t2.key])/100 + "%</span>").appendTo(desc);

        var possibleGroupsTitle = $('<div class="extra-g-title">Groups with highest chance to occur for each team:</div>').appendTo(desc);

        var possGroupsLeft = $('<div class="extra-poss-g-left"/>').appendTo(desc);
        var possGroupsRight = $('<div class="extra-poss-g-right"/>').appendTo(desc);

        this.renderAllPossibleGroups(t1.key).appendTo(possGroupsLeft);
        this.renderAllPossibleGroups(t2.key).appendTo(possGroupsRight);

        w.show();
    },
    renderAllPossibleGroups: function(teamKey) {
        var groups = this.getMostPossibleGroups(teamKey);

        var el = $('<div class="poss-groups" />');

        var p = groups[0].poss;

        var l = $('<div class="poss-group-info" />').html("Each group has a " + Math.round(10000*p/this.teamGroups[teamKey])/100 + "% chance to happen").appendTo(el);

        var groupsContainer = $('<div class="poss-groups-wrap" />').appendTo(el);

        for(var i in groups) {
            groupsContainer.append(this.renderPossibleGroupWidget(groups[i].g));
        }

        return el;
    },
    renderPossibleGroupWidget: function(teams) {
        var el = $('<div class="poss-group"/>');

        for(var i in teams) {
            var team = teams[i];

            var teamEl = $("<div class='poss-group-team-el' />").html("<img src='img/" + team.key.toLowerCase() + ".png'/>").appendTo(el);
        }
        return el;
    },
    getMostPossibleGroups: function(teamKey) {
        var result = [];

        var maxPoss = 0;

        for(var i in this.teamPossGroups[teamKey]) {
            maxPoss = Math.max(maxPoss, this.teamPossGroups[teamKey][i]);
        }

        for(var i in this.teamPossGroups[teamKey]) {
            if(this.teamPossGroups[teamKey][i] == maxPoss) {
                var keys = i.split("_");
                var g = [];
                for(var k in keys) {
                    g.push(this.findTeam(keys[k]));
                }
                result.push({
                    poss: maxPoss,
                    g: g
                });
            }
        }

        return result;
    },
    clearExtraInfo: function() {
        $('.extra-info').html("").hide();
    }
}

$(document).ready(function() {
    drawsCalculator.init();
});
