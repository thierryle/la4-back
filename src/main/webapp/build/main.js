webpackJsonp([18],{

/***/ 111:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArchiveDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_backend_backend__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the ArchiveDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ArchiveDetailPage = (function () {
    function ArchiveDetailPage(navCtrl, navParams, formBuilder, util, backend) {
        this.navCtrl = navCtrl;
        this.util = util;
        this.backend = backend;
        this.submitAttempt = false;
        this.nbAwardsByUser = {};
        this.loaded = false;
        var paramArchive = navParams.get('archive');
        this.categories = navParams.get('categories');
        this.users = navParams.get('users');
        if (paramArchive == null) {
            // Création
            this.archive = {
                'id': null,
                'year': '',
                'categoriesIds': null,
                'ranking': null
            };
            this.loseAward = { 'year': null, 'categoryId': null, 'usersIds': null };
            this.awardsAndReport = {
                'archiveAwards': [this.loseAward],
                'archiveReport': { report: '' }
            };
            this.title = 'Nouvelle archive';
            this.updateNbAwardsByUser();
            this.loaded = true;
        }
        else {
            // Modification
            this.archive = {
                'id': paramArchive.id,
                'year': paramArchive.year,
                'categoriesIds': paramArchive.categoriesIds,
                'ranking': paramArchive.ranking
            };
            this.title = 'Modification de l\'archive';
            this.getAwardsAndReport(paramArchive.year);
        }
        this.archiveForm = formBuilder.group({
            year: [this.archive.year, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            categoriesIds: [this.archive.categoriesIds, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            losersIds: [__WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
        });
    }
    ArchiveDetailPage.prototype.ionViewDidLoad = function () {
    };
    ArchiveDetailPage.prototype.save = function () {
        var _this = this;
        this.submitAttempt = true;
        if (this.archiveForm.valid) {
            this.updateAwardsAndReportYear();
            if (this.archive.id != null) {
                // Mise à jour
                this.backend.updateArchiveWithAwardsAndReport({ archive: this.archive, archiveAwards: this.awardsAndReport.archiveAwards, archiveReport: this.awardsAndReport.archiveReport }).subscribe(function () {
                    _this.navCtrl.pop();
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
            else {
                // Création
                this.backend.addArchiveWithAwardsAndReport({ archive: this.archive, archiveAwards: this.awardsAndReport.archiveAwards, archiveReport: this.awardsAndReport.archiveReport }).subscribe(function () {
                    _this.navCtrl.pop();
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        }
    };
    /**
     * Retourne la récompense pour une catégorie.
     */
    ArchiveDetailPage.prototype.getAwardByCategory = function (categoryId) {
        for (var _i = 0, _a = this.awardsAndReport.archiveAwards; _i < _a.length; _i++) {
            var award_1 = _a[_i];
            if (award_1.categoryId == categoryId) {
                return award_1;
            }
        }
        // Récompense non-trouvée : on la crée
        var award = { year: null, categoryId: categoryId, usersIds: null, reason: null };
        this.awardsAndReport.archiveAwards.push(award);
        return award;
    };
    /**
     * Appel du backend pour récupérer les récompenses et le rapport.
     */
    ArchiveDetailPage.prototype.getAwardsAndReport = function (year) {
        var _this = this;
        this.backend.getArchiveAwardsAndReport(year).subscribe(function (data) {
            _this.awardsAndReport = data;
            // Recherche du lose award
            for (var _i = 0, _a = _this.awardsAndReport.archiveAwards; _i < _a.length; _i++) {
                var award = _a[_i];
                if (award.categoryId == null) {
                    _this.loseAward = award;
                    break;
                }
            }
            if (_this.loseAward == null) {
                _this.loseAward = { 'year': null, 'categoryId': null, 'usersIds': null };
                _this.awardsAndReport.archiveAwards.push(_this.loseAward);
            }
            _this.updateNbAwardsByUser();
            _this.loaded = true;
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    /*
    getNbAwardsByUser(user) {
      let nbAwards = 0;
      for (let award of this.awards) {
        if (award.categoryId != null && award.usersIds != null && award.usersIds.indexOf(user.id) != -1) {
          nbAwards++;
        }
      }
      return nbAwards;
    }
    */
    /**
     * Mise à jour du nombre de récompenses par utilisateur.
     */
    ArchiveDetailPage.prototype.updateNbAwardsByUser = function () {
        // On initialise à zéro récompense par compétiteur
        this.nbAwardsByUser = {};
        for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
            var user = _a[_i];
            this.nbAwardsByUser[user.id] = 0;
        }
        // Parcours des récompenses
        for (var _b = 0, _c = this.awardsAndReport.archiveAwards; _b < _c.length; _b++) {
            var award = _c[_b];
            if (award.categoryId != null && award.usersIds != null) {
                for (var _d = 0, _e = award.usersIds; _d < _e.length; _d++) {
                    var userId = _e[_d];
                    this.nbAwardsByUser[userId] = this.nbAwardsByUser[userId] + 1;
                }
            }
        }
    };
    /**
     * Mise à jour du classement (après sélection par l'utilisateur du Grand Champion)
     */
    ArchiveDetailPage.prototype.updateRanking = function () {
        this.archive.ranking = {};
        var rank = 1;
        this.archive.ranking[rank] = this.loseAward.usersIds;
        rank += this.loseAward.usersIds.length;
        var maxNbAwards = this.nbAwardsByUser[this.loseAward.usersIds[0]];
        for (var nbAwards = maxNbAwards; nbAwards >= 0; nbAwards--) {
            // Qui parmi les compétiteurs a le nombre courant de récompenses, à part les Grands Champions ?
            var currentRankUsers = void 0;
            for (var _i = 0, _a = this.users; _i < _a.length; _i++) {
                var user = _a[_i];
                var nbAwardsOfOneUser = this.nbAwardsByUser[user.id];
                if (nbAwardsOfOneUser == nbAwards && this.loseAward.usersIds.indexOf(user.id) == -1) {
                    currentRankUsers = this.archive.ranking[rank];
                    if (currentRankUsers == null) {
                        currentRankUsers = [];
                        this.archive.ranking[rank] = currentRankUsers;
                    }
                    currentRankUsers.push(user.id);
                }
            }
            // A-t-on trouvé des compétiteurs ?
            if (currentRankUsers != null) {
                rank += currentRankUsers.length;
            }
        }
    };
    ArchiveDetailPage.prototype.getRankingKeys = function () {
        return Object.keys(this.archive.ranking);
    };
    /**
     * Mise à jour de la liste des récompenses possibles (après sélection par l'utilisateur des catégories possibles)
     */
    ArchiveDetailPage.prototype.updateCategories = function () {
        this.awardsAndReport.archiveAwards = [];
        for (var _i = 0, _a = this.archive.categoriesIds; _i < _a.length; _i++) {
            var categoryId = _a[_i];
            this.awardsAndReport.archiveAwards.push({ year: null, categoryId: categoryId, usersIds: null, reason: null });
        }
        this.awardsAndReport.archiveAwards.push(this.loseAward);
    };
    /**
     * Mise à jour de l'année dans les récompenses et le rapport.
     */
    ArchiveDetailPage.prototype.updateAwardsAndReportYear = function () {
        for (var _i = 0, _a = this.awardsAndReport.archiveAwards; _i < _a.length; _i++) {
            var award = _a[_i];
            award.year = this.archive.year;
        }
        this.awardsAndReport.archiveReport.year = this.archive.year;
        ;
    };
    ArchiveDetailPage.prototype.cancel = function () {
        this.navCtrl.pop();
    };
    ArchiveDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-archive-detail',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\archive-detail\archive-detail.html"*/'<!--\n  Generated template for the ArchiveDetailPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <page-top-header [subtitle]="title"></page-top-header>\n</ion-header>\n\n<ion-content padding>\n  <ng-container *ngIf="loaded">\n    <ion-list>\n      <form [formGroup]="archiveForm">\n        <!-- Vision admin -->\n        <ng-container *ngIf="backend.isAdminConnected(); else noadmin">\n          <!-- Année -->\n          <ion-item>\n            <ion-label floating color="primary">Ann&eacute;e</ion-label>\n            <ion-input type="number" formControlName="year" [(ngModel)]="archive.year"></ion-input >\n          </ion-item>\n          <div class="valid-error" *ngIf="!archiveForm.controls.year.valid && (archiveForm.controls.year.dirty || submitAttempt)">\n            <p *ngIf="archiveForm.controls.year.errors.required">Veuillez saisir l\'année.</p>\n          </div>\n          <!-- Liste des catégories -->\n          <ion-item>\n            <ion-label floating color="primary">Liste des cat&eacute;gories</ion-label>\n            <ion-select multiple="true" cancelText="Annuler" okText="OK" formControlName="categoriesIds" [(ngModel)]="archive.categoriesIds" (ionChange)="updateCategories()">\n              <ion-option *ngFor="let category of categories" [value]="category.id">{{category.name}}</ion-option>\n            </ion-select>\n          </ion-item>\n        </ng-container>\n        <!-- Vision pas admin -->\n        <ng-template #noadmin>\n          <ion-item>\n            <ion-label floating color="primary">Ann&eacute;e</ion-label>\n            <ion-input disabled="true" type="number" [(ngModel)]="archive.year" [ngModelOptions]="{ standalone: true }"></ion-input >\n          </ion-item>\n        </ng-template>\n\n        <!-- Parcours des catégories -->\n        <ion-item *ngFor="let categoryId of archive.categoriesIds">\n          <ion-label floating color="primary">Vainqueurs de la cat&eacute;gorie {{util.getCategoryNameFromList(categoryId, categories)}}</ion-label>\n          <ion-select multiple="true" cancelText="Annuler" okText="OK" [(ngModel)]="getAwardByCategory(categoryId).usersIds" [ngModelOptions]="{ standalone: true }" (ionChange)="updateNbAwardsByUser()">\n            <ion-option *ngFor="let user of users" [value]="user.id">{{util.getDisplayName(user)}}</ion-option>\n          </ion-select>\n          <ion-textarea placeholder="Raison" [(ngModel)]="getAwardByCategory(categoryId).reason" [ngModelOptions]="{ standalone: true }" style="font-size: 1.4rem"></ion-textarea>\n        </ion-item>\n        <!-- Lose award -->\n        <ion-item>\n          <ion-label floating color="primary">Losers de l\'ann&eacute;e</ion-label>\n          <ion-select multiple="true" cancelText="Annuler" okText="OK" formControlName="losersIds" [(ngModel)]="loseAward.usersIds" (ionChange)="updateRanking()">\n            <ion-option *ngFor="let user of users" [value]="user.id">\n              <!-- Thierry (2 récompenses) -->\n              {{util.getDisplayName(user)}} ({{util.getPlural(nbAwardsByUser[user.id], "r&eacute;compense")}})\n            </ion-option>\n          </ion-select>\n        </ion-item>\n      </form>\n    </ion-list>\n\n    <!-- Classement -->\n    <ul *ngIf="archive.ranking != null">\n      <ng-container *ngFor="let rank of getRankingKeys()">\n        <li *ngIf="rank != 1">\n          <!-- Deuxième position : Thierry et Sophie (2 récompenses) -->\n          {{util.getOrdinal(rank)}} :\n          {{util.getUsersNamesFromList(archive.ranking[rank], users)}}\n          ({{util.getPlural(nbAwardsByUser[archive.ranking[rank][0]], "r&eacute;compense")}})\n        </li>\n      </ng-container>\n    </ul>\n\n    <!-- Rapport de mi-saison-->\n    <ion-list>\n      <ion-item>\n        <ion-label floating color="primary">Rapport de mi-saison</ion-label>\n        <ion-textarea [(ngModel)]="awardsAndReport.archiveReport.midReport" class="report"></ion-textarea>\n      </ion-item>\n    </ion-list>\n\n    <!-- Rapport -->\n    <ion-list>\n        <ion-item>\n          <ion-label floating color="primary">Rapport</ion-label>\n<!--          <ion-textarea [(ngModel)]="awardsAndReport.archiveReport.report" class="report" (ionChange)="setDirty()"></ion-textarea>-->\n          <ion-textarea [(ngModel)]="awardsAndReport.archiveReport.report" class="report"></ion-textarea>\n        </ion-item>\n    </ion-list>\n\n    <div padding>\n      <button [disabled]="!archiveForm.valid" ion-button color="primary" (click)="save()">Valider</button>\n      <button ion-button color="primary" (click)="cancel()">Annuler</button>\n    </div>\n  </ng-container>\n</ion-content>\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\archive-detail\archive-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_backend_backend__["a" /* BackendProvider */]])
    ], ArchiveDetailPage);
    return ArchiveDetailPage;
}());

//# sourceMappingURL=archive-detail.js.map

/***/ }),

/***/ 112:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ArchivePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__archive_detail_archive_detail__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__stat_category_stat_category__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__stat_user_stat_user__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__stat_record_stat_record__ = __webpack_require__(115);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








//import { DragulaService } from 'ng2-dragula/ng2-dragula';
/**
 * Generated class for the ArchivePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ArchivePage = (function () {
    function ArchivePage(navCtrl, navParams, backend, util, alertCtrl, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.util = util;
        this.alertCtrl = alertCtrl;
        this.modalCtrl = modalCtrl;
    }
    ArchivePage.prototype.ionViewDidLoad = function () {
    };
    ArchivePage.prototype.ionViewDidEnter = function () {
        this.loadArchive();
    };
    ArchivePage.prototype.loadArchive = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getArchiveBundle().subscribe(function (data) {
            _this.bundle = data;
            if (_this.bundle.archiveUsers == null) {
                _this.bundle.archiveUsers = [];
            }
            if (_this.bundle.archiveCategories == null) {
                _this.bundle.archiveCategories = [];
            }
            if (_this.bundle.losersByYear == null) {
                _this.bundle.losersByYear = [];
            }
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    };
    // ===== Catégories =====
    ArchivePage.prototype.addCategory = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Nouvelle catégorie',
            inputs: [
                { name: 'name', placeholder: 'Nom de la catégorie' }
            ],
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                { text: 'OK', handler: function (data) { return _this.addCategoryBackend(data); } }
            ]
        });
        alert.present();
    };
    ArchivePage.prototype.addCategoryBackend = function (data) {
        var _this = this;
        if (data['name'] == null || data['name'] == '') {
            return false;
        }
        var category = { id: null, name: data['name'] };
        this.backend.addArchiveCategory(category).subscribe(function (data) {
            // Mise à jour de l'IHM
            _this.bundle.archiveCategories.push(data);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    ArchivePage.prototype.editCategory = function (category) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Modification de la catégorie',
            inputs: [
                { name: 'name', placeholder: 'Nom de la catégorie', value: category.name }
            ],
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                { text: 'OK', handler: function (data) { return _this.updateCategoryBackend(category, data); } }
            ]
        });
        alert.present();
    };
    ArchivePage.prototype.updateCategoryBackend = function (category, data) {
        var _this = this;
        if (data['name'] == null || data['name'] == '') {
            return false;
        }
        category.name = data['name'];
        this.backend.updateArchiveCategory(category).subscribe(function () {
            // Mise à jour de l'IHM
            for (var i = 0; i < _this.bundle.archiveCategories.length; i++) {
                if (_this.bundle.archiveCategories[i].id == category.id) {
                    _this.bundle.archiveCategories[i] = category;
                    break;
                }
            }
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    ArchivePage.prototype.deleteCategory = function (event, category) {
        event.stopPropagation();
        this.util.confirm('Suppression de la catégorie', 'La suppression de la catégorie entraînera la suppression des archives liées. Etes-vous sûr de vouloir la supprimer ?', this.deleteCategoryBackend.bind(this), category);
    };
    ArchivePage.prototype.deleteCategoryBackend = function (category) {
        var _this = this;
        this.backend.deleteArchiveCategory(category).subscribe(function () {
            // Mise à jour de l'IHM
            _this.loadArchive();
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    // ===== Utilisateurs =====
    ArchivePage.prototype.addUser = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Nouveau user',
            inputs: [
                { name: 'firstName', placeholder: 'Prénom' },
                { name: 'lastName', placeholder: 'Nom' },
                { name: 'firstYear', placeholder: 'Première participation' },
                { name: 'lastYear', placeholder: 'Dernière participation' }
            ],
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                { text: 'OK', handler: function (data) { return _this.addUserBackend(data); } }
            ]
        });
        alert.present();
    };
    ArchivePage.prototype.addUserBackend = function (data) {
        var _this = this;
        if (!this.checkUserData(data)) {
            return false;
        }
        var user = { id: null, firstName: data['firstName'], lastName: data['lastName'], firstYear: data['firstYear'], lastYear: data['lastYear'] };
        this.backend.addArchiveUser(user).subscribe(function (data) {
            _this.bundle.archiveUsers.push(data);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    ArchivePage.prototype.editUser = function (user) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Modification du compétiteur',
            inputs: [
                { name: 'firstName', placeholder: 'Prénom du compétiteur', value: user.firstName },
                { name: 'lastName', placeholder: 'Nom du compétiteur', value: user.lastName },
                { name: 'firstYear', placeholder: 'Première participation', value: user.firstYear },
                { name: 'lastYear', placeholder: 'Dernière participation', value: user.lastYear }
            ],
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                { text: 'OK', handler: function (data) { return _this.updateUserBackend(user, data); } }
            ]
        });
        alert.present();
    };
    ArchivePage.prototype.updateUserBackend = function (user, data) {
        var _this = this;
        if (!this.checkUserData(data)) {
            return false;
        }
        user.firstName = data['firstName'];
        user.lastName = data['lastName'];
        user.firstYear = data['firstYear'];
        user.lastYear = data['lastYear'];
        this.backend.updateArchiveUser(user).subscribe(function (data) {
            // Mise à jour de l'IHM
            for (var i = 0; i < _this.bundle.archiveUsers.length; i++) {
                if (_this.bundle.archiveUsers[i].id == user.id) {
                    _this.bundle.archiveUsers[i] = user;
                    break;
                }
            }
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    ArchivePage.prototype.checkUserData = function (data) {
        if (data['firstName'] == null || data['firstName'] == '') {
            return false;
        }
        if (data['firstYear'] != null && isNaN(data['firstYear'])) {
            return false;
        }
        if (data['lastYear'] != null && isNaN(data['lastYear'])) {
            return false;
        }
        return true;
    };
    ArchivePage.prototype.deleteUser = function (event, user) {
        event.stopPropagation();
        this.util.confirm('Suppression du compétiteur', 'La suppression du compétiteur entraînera la suppression de ses récompenses. Etes-vous sûr de vouloir le supprimer ?', this.deleteUserBackend.bind(this), user);
    };
    ArchivePage.prototype.deleteUserBackend = function (user) {
        var _this = this;
        this.backend.deleteArchiveUser(user).subscribe(function () {
            // Mise à jour de l'IHM
            for (var i = 0; i < _this.bundle.archiveUsers.length; i++) {
                if (_this.bundle.archiveUsers[i].id == user.id) {
                    _this.bundle.archiveUsers.splice(i, 1);
                    break;
                }
            }
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    // ===== Archive =====
    ArchivePage.prototype.addArchive = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__archive_detail_archive_detail__["a" /* ArchiveDetailPage */], { 'users': this.bundle.archiveUsers, 'categories': this.bundle.archiveCategories });
    };
    ArchivePage.prototype.editArchive = function (archive) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__archive_detail_archive_detail__["a" /* ArchiveDetailPage */], { 'users': this.getRestrictedUsers(archive.year), 'categories': this.bundle.archiveCategories, 'archive': archive });
    };
    ArchivePage.prototype.deleteArchive = function (event, archive) {
        event.stopPropagation();
        this.util.confirm('Suppression de l\'archive', 'Etes-vous sûr de vouloir supprimer l\'archive ?', this.deleteArchiveBackend.bind(this), archive);
    };
    ArchivePage.prototype.deleteArchiveBackend = function (archive) {
        var _this = this;
        this.backend.deleteArchive(archive).subscribe(function () {
            // Mise à jour de l'IHM
            for (var i = 0; i < _this.bundle.archives.length; i++) {
                if (_this.bundle.archives[i].id == archive.id) {
                    _this.bundle.archives.splice(i, 1);
                    break;
                }
            }
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    ArchivePage.prototype.getRestrictedUsers = function (year) {
        var restrictedUsers = [];
        for (var _i = 0, _a = this.bundle.archiveUsers; _i < _a.length; _i++) {
            var user = _a[_i];
            if ((user.firstYear == null || user.firstYear <= year) && (user.lastYear == null || user.lastYear >= year)) {
                restrictedUsers.push(user);
            }
        }
        return restrictedUsers;
    };
    ArchivePage.prototype.getLosersByYear = function (year) {
        var usersIds = this.bundle.losersByYear[year];
        return this.util.getUsersNamesFromList(usersIds, this.bundle.archiveUsers);
    };
    // ===== Statistiques =====
    ArchivePage.prototype.statCategory = function (event, category) {
        if (event != null) {
            event.stopPropagation();
        }
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__stat_category_stat_category__["a" /* StatCategoryPage */], { 'category': category, 'users': this.bundle.archiveUsers });
        modal.present();
    };
    ArchivePage.prototype.statCategoryGrandChampion = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__stat_category_stat_category__["a" /* StatCategoryPage */], { 'category': null, 'users': this.bundle.archiveUsers });
        modal.present();
    };
    ArchivePage.prototype.statUser = function (event, user) {
        if (event != null) {
            event.stopPropagation();
        }
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_6__stat_user_stat_user__["a" /* StatUserPage */], { 'user': user, 'categories': this.bundle.archiveCategories });
        modal.present();
    };
    ArchivePage.prototype.statRecords = function () {
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_7__stat_record_stat_record__["a" /* StatRecordPage */], { 'categories': this.bundle.archiveCategories, 'users': this.bundle.archiveUsers });
        modal.present();
    };
    ArchivePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-archive',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\archive\archive.html"*/'<!--\n\n  Generated template for the ArchivePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <page-top-header subtitle="Archives"></page-top-header>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-grid *ngIf="bundle">\n\n    <ion-row>\n\n      <ion-col col-4>\n\n        <!-- Archive -->\n\n        <ion-card>\n\n          <ion-card-header style="padding: 0 !important;">\n\n            <ion-grid>\n\n              <ion-row>\n\n                <ion-col>\n\n                  Archives\n\n                </ion-col>\n\n                <ion-col *ngIf="backend.isAdminConnected()" style="max-width: 36px;">\n\n                  <button ion-button icon-only clear color="danger" class="icon-button inline-icon-button" (click)="addArchive()" title="Ajouter une archive">\n\n                    <ion-icon name="add-circle"></ion-icon>\n\n                  </button>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </ion-card-header>\n\n          <ion-list>\n\n            <button ion-item *ngFor="let archive of bundle.archives" (click)="editArchive(archive)">\n\n              {{archive.year}} ({{getLosersByYear(archive.year)}})\n\n              <button *ngIf="backend.isAdminConnected()" ion-button icon-only clear item-end color="danger" class="icon-button" (click)="deleteArchive($event, archive)" title="Supprimer l\'archive\'">\n\n                <ion-icon name="trash"></ion-icon>\n\n              </button>\n\n            </button>\n\n          </ion-list>\n\n        </ion-card>\n\n      </ion-col>\n\n      <ion-col col-4>\n\n        <!-- Catégories -->\n\n        <ion-card>\n\n          <ion-card-header style="padding: 0 !important;">\n\n            <ion-grid>\n\n              <ion-row>\n\n                <ion-col>\n\n                  Statistiques par cat&eacute;gorie\n\n                </ion-col>\n\n                <ion-col *ngIf="backend.isAdminConnected()" style="max-width: 36px;">\n\n                  <button ion-button icon-only clear color="danger" class="icon-button inline-icon-button" (click)="addCategory()" title="Ajouter une cat&eacute;gorie">\n\n                    <ion-icon name="add-circle"></ion-icon>\n\n                  </button>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </ion-card-header>\n\n          <ion-list>\n\n            <!-- Records -->\n\n            <button ion-item (click)="statRecords()">\n\n              <b>Records par cat&eacute;gorie</b>\n\n            </button>\n\n            <!-- Vision admin -->\n\n            <ng-container *ngIf="backend.isAdminConnected(); else category_noadmin">\n\n              <!-- Grand champion -->\n\n              <button ion-item>\n\n                <b>Grand Champion</b>\n\n                <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="statCategoryGrandChampion()" title="Statistiques Grand Champion">\n\n                  <ion-icon name="stats"></ion-icon>\n\n                </button>\n\n              </button>\n\n              <!-- Autres catégories -->\n\n              <button ion-item *ngFor="let category of bundle.archiveCategories" (click)="editCategory(category)">\n\n                {{category.name}}\n\n                <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="statCategory($event, category)" title="Statistiques de la cat&eacute;gorie">\n\n                  <ion-icon name="stats"></ion-icon>\n\n                </button>\n\n                <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="deleteCategory($event, category)" title="Supprimer la cat&eacute;gorie">\n\n                  <ion-icon name="trash"></ion-icon>\n\n                </button>\n\n              </button>\n\n            </ng-container>\n\n            <!-- Vision pas admin -->\n\n            <ng-template #category_noadmin>\n\n              <!-- Grand champion -->\n\n              <button ion-item (click)="statCategoryGrandChampion()">\n\n                <b>Grand Champion</b>\n\n              </button>\n\n              <!-- Autres catégories -->\n\n              <button ion-item *ngFor="let category of bundle.archiveCategories" (click)="statCategory(null, category)">\n\n                {{category.name}}\n\n              </button>\n\n            </ng-template>\n\n          </ion-list>\n\n        </ion-card>\n\n      </ion-col>\n\n      <ion-col col-4>\n\n        <!-- Compétiteurs -->\n\n        <ion-card>\n\n          <ion-card-header style="padding: 0 !important;">\n\n            <ion-grid>\n\n              <ion-row>\n\n                <ion-col>\n\n                  Statistiques par comp&eacute;titeur\n\n                </ion-col>\n\n                <ion-col *ngIf="backend.isAdminConnected()" style="max-width: 36px;">\n\n                  <button ion-button icon-only clear color="danger" class="icon-button inline-icon-button" (click)="addUser()" title="Ajouter un comp&eacute;titeur">\n\n                    <ion-icon name="add-circle"></ion-icon>\n\n                  </button>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </ion-card-header>\n\n          <ion-list>\n\n            <!-- Vision admin -->\n\n            <ng-container *ngIf="backend.isAdminConnected(); else user_noadmin">\n\n              <button ion-item *ngFor="let user of bundle.archiveUsers" (click)="editUser(user)">\n\n                {{user.firstName}} {{user.lastName}}\n\n                <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="statUser($event, user)" title="Statistiques du comp&eacute;titeur">\n\n                  <ion-icon name="stats"></ion-icon>\n\n                </button>\n\n                <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="deleteUser($event, user)" title="Supprimer le comp&eacute;titeur">\n\n                  <ion-icon name="trash"></ion-icon>\n\n                </button>\n\n              </button>\n\n            </ng-container>\n\n            <!-- Vision pas admin -->\n\n            <ng-template #user_noadmin>\n\n              <button ion-item *ngFor="let user of bundle.archiveUsers" (click)="statUser(null, user)">\n\n                {{user.firstName}} {{user.lastName}}\n\n              </button>\n\n            </ng-template>\n\n          </ion-list>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\archive\archive.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */]])
    ], ArchivePage);
    return ArchivePage;
}());

//# sourceMappingURL=archive.js.map

/***/ }),

/***/ 113:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatCategoryPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_highcharts__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_highcharts__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_highcharts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_highcharts__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the StatCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var StatCategoryPage = (function () {
    function StatCategoryPage(navCtrl, navParams, viewCtrl, backend, util) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.backend = backend;
        this.util = util;
        this.category = this.navParams.get('category');
        this.users = this.navParams.get('users');
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        if (this.category != null) {
            this.backend.getStatCategory(this.category).subscribe(function (data) {
                _this.stat = data;
                _this.buildChart();
                loading.dismiss();
            }, function (error) {
                _this.util.handleError(error);
                loading.dismiss();
            });
        }
        else {
            // Grand Champion
            this.backend.getStatCategoryGrandChampion().subscribe(function (data) {
                _this.stat = data;
                _this.buildChart();
                loading.dismiss();
            }, function (error) {
                _this.util.handleError(error);
                loading.dismiss();
            });
        }
    }
    StatCategoryPage.prototype.ionViewDidLoad = function () {
    };
    StatCategoryPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    StatCategoryPage.prototype.buildChart = function () {
        this.chart = new __WEBPACK_IMPORTED_MODULE_4_angular_highcharts__["a" /* Chart */]({
            chart: { type: 'pie' },
            title: { text: null },
            credits: { enabled: false },
            tooltip: {
                //pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                formatter: function () {
                    return '<b>' + this.point.name + '</b>: ' + __WEBPACK_IMPORTED_MODULE_5_highcharts__["numberFormat"](this.percentage, 1) + ' %';
                }
            },
            series: [
                { /*name: null,*/ data: this.stat.graphicsData }
            ]
        });
        // this.chart.addPoint({name: 'Other', y: 9});
    };
    StatCategoryPage.prototype.getWinners = function () {
        return Object.keys(this.stat.awardsByUser);
    };
    StatCategoryPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-stat-category',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\stat-category\stat-category.html"*/'<!--\n\n  Generated template for the StatCategoryPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <ng-container *ngIf="category != null; else grand_champion">Statistiques de la cat&eacute;gorie {{category.name}}</ng-container>\n\n      <ng-template #grand_champion>Statistiques Grand Champion</ng-template>      \n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list no-lines *ngIf="stat">\n\n    <ion-item *ngIf="category != null" text-wrap>\n\n       <b>Ann&eacute;es d\'apparition :</b>\n\n       {{stat.appearingYears.join(\', \')}}\n\n     </ion-item>\n\n     <ion-item *ngFor="let userId of getWinners()" text-wrap>\n\n       <!-- Thierry : 3 victoires (2009, 2010, 2012) -->\n\n       {{util.getUserNameFromList(userId, users)}} :\n\n       {{util.getPlural(stat.awardsByUser[userId].length, "victoire")}}\n\n       ({{stat.awardsByUser[userId].join(\', \')}})\n\n     </ion-item>\n\n  </ion-list>\n\n  <div [chart]="chart"></div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\stat-category\stat-category.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], StatCategoryPage);
    return StatCategoryPage;
}());

//# sourceMappingURL=stat-category.js.map

/***/ }),

/***/ 114:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatUserPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angular_highcharts__ = __webpack_require__(83);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_highcharts__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_highcharts___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_highcharts__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the StatUserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var StatUserPage = (function () {
    function StatUserPage(navCtrl, navParams, viewCtrl, backend, util) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.backend = backend;
        this.util = util;
        this.nbAwards = 0;
        this.nbCategories = 0;
        this.statType = 'division';
        this.user = this.navParams.get('user');
        this.categories = this.navParams.get('categories');
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        this.backend.getStatUser(this.user).subscribe(function (data) {
            _this.stat = data;
            _this.setTotal();
            _this.buildCharts();
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    }
    StatUserPage.prototype.ionViewDidLoad = function () {
    };
    StatUserPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    StatUserPage.prototype.getWonCategories = function () {
        if (this.stat.awardsByCategory == null) {
            return [];
        }
        return Object.keys(this.stat.awardsByCategory);
    };
    /**
     * Calcule le total des récompenses et des catégories.
     */
    StatUserPage.prototype.setTotal = function () {
        if (this.stat.awardsByCategory != null) {
            for (var _i = 0, _a = Object.keys(this.stat.awardsByCategory); _i < _a.length; _i++) {
                var categoryId = _a[_i];
                if (categoryId != '-1') {
                    this.nbAwards += this.stat.awardsByCategory[categoryId].length;
                    this.nbCategories++;
                }
            }
        }
    };
    StatUserPage.prototype.buildCharts = function () {
        this.divisionChart = new __WEBPACK_IMPORTED_MODULE_4_angular_highcharts__["a" /* Chart */]({
            chart: { type: 'pie' },
            title: { text: null },
            credits: { enabled: false },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.point.name + '</b>: ' + __WEBPACK_IMPORTED_MODULE_5_highcharts__["numberFormat"](this.percentage, 1) + ' %';
                }
            },
            series: [{ data: this.stat.graphicsData }]
        });
        this.progressionChart = new __WEBPACK_IMPORTED_MODULE_4_angular_highcharts__["a" /* Chart */]({
            title: { text: null },
            credits: { enabled: false },
            xAxis: { categories: this.stat.progressionGraphicsData.years },
            yAxis: {
                title: { text: null }
            },
            plotOptions: {
                line: {
                    dataLabels: { enabled: true }
                }
            },
            series: [{
                    name: 'Récompenses',
                    data: this.stat.progressionGraphicsData.nbAwards
                }, {
                    name: 'Classement',
                    data: this.stat.progressionGraphicsData.ranks
                }]
        });
    };
    StatUserPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-stat-user',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\stat-user\stat-user.html"*/'<!--\n  Generated template for the StatUserPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-toolbar>\n    <ion-title>\n      Statistiques du comp&eacute;titeur {{util.getDisplayName(user)}}\n    </ion-title>\n    <ion-buttons start>\n      <button ion-button (click)="dismiss()">\n        <ion-icon name="md-close"></ion-icon>\n      </button>\n    </ion-buttons>\n  </ion-toolbar>\n\n</ion-header>\n\n<ion-content padding>\n  <ion-list no-lines *ngIf="stat">\n    <!-- Années de participation -->\n    <ion-item text-wrap>\n      <b>Ann&eacute;es de participation :</b>\n      <ng-container *ngIf="user.lastYear != null; else no_last_year">\n        de {{user.firstYear}} &agrave; {{user.lastYear}}\n      </ng-container>\n      <ng-template #no_last_year>\n        depuis {{user.firstYear}}\n      </ng-template>\n    </ion-item>\n    <!-- Catégories -->\n    <ng-container *ngFor="let categoryId of getWonCategories()">\n      <ion-item *ngIf="categoryId != -1" text-wrap>\n        <!-- Catégorie Boulet : 3 victoires (2009, 2010, 2012) -->\n        {{util.getCategoryNameFromList(categoryId, categories)}} :\n        {{util.getPlural(stat.awardsByCategory[categoryId].length, "victoire")}}\n        ({{stat.awardsByCategory[categoryId].join(\', \')}})\n      </ion-item>\n    </ng-container>\n    <!-- Total -->\n    <ion-item *ngIf="nbAwards > 0" text-wrap>\n      <b>Total :</b>\n      {{util.getPlural(nbAwards, "victoire")}}\n      dans\n      {{util.getPlural(nbCategories, "cat&eacute;gorie")}}\n    </ion-item>\n    <!-- Grand Champion -->\n    <ion-item *ngIf="stat.awardsByCategory != null && stat.awardsByCategory[-1] != null && stat.awardsByCategory[-1].length > 0" text-wrap>\n      <b>Grand Champion :</b> {{stat.awardsByCategory[-1].length}} fois\n      ({{stat.awardsByCategory[-1].join(\', \')}})\n    </ion-item>\n  </ion-list>\n\n  <!-- Onglets des statistiques -->\n  <ion-segment [(ngModel)]="statType">\n    <ion-segment-button value="division">\n      R&eacute;partition\n    </ion-segment-button>\n    <ion-segment-button value="progression">\n      Progression\n    </ion-segment-button>\n  </ion-segment>\n\n  <!-- Statistiques de répartition -->\n  <ng-container [ngSwitch]="statType">\n    <div *ngSwitchCase="\'division\'" [chart]="divisionChart"></div>\n    <div *ngSwitchCase="\'progression\'" [chart]="progressionChart"></div>\n  </ng-container>\n</ion-content>\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\stat-user\stat-user.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], StatUserPage);
    return StatUserPage;
}());

//# sourceMappingURL=stat-user.js.map

/***/ }),

/***/ 115:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatRecordPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the StatRecordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var StatRecordPage = (function () {
    function StatRecordPage(navCtrl, navParams, viewCtrl, backend, util) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.backend = backend;
        this.util = util;
        this.categories = this.navParams.get('categories');
        this.users = this.navParams.get('users');
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        this.backend.getStatRecords().subscribe(function (data) {
            _this.recordsByCategory = data['usersAndRecords'];
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    }
    StatRecordPage.prototype.ionViewDidLoad = function () {
    };
    StatRecordPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    StatRecordPage.prototype.getCategoriesIds = function () {
        return Object.keys(this.recordsByCategory);
    };
    StatRecordPage.prototype.getUsersNames = function (categoryId) {
        var usersIds = [];
        var usersAndRecords = this.recordsByCategory[categoryId];
        for (var _i = 0, usersAndRecords_1 = usersAndRecords; _i < usersAndRecords_1.length; _i++) {
            var userAndRecord = usersAndRecords_1[_i];
            usersIds.push(userAndRecord.userId);
        }
        return this.util.getUsersNamesFromList(usersIds, this.users);
    };
    StatRecordPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-stat-record',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\stat-record\stat-record.html"*/'<!--\n\n  Generated template for the StatRecordPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <ion-toolbar>\n\n    <ion-title>Records par cat&eacute;gorie</ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list no-lines *ngIf="recordsByCategory">\n\n    <ng-container *ngFor="let categoryId of getCategoriesIds()">\n\n      <ion-item *ngIf="categoryId != -1" text-wrap>\n\n        {{util.getCategoryNameFromList(categoryId, categories)}} : {{getUsersNames(categoryId)}}\n\n        ({{util.getPlural(recordsByCategory[categoryId][0].record, \'victoire\')}})\n\n      </ion-item>\n\n    </ng-container>\n\n  </ion-list>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\stat-record\stat-record.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], StatRecordPage);
    return StatRecordPage;
}());

//# sourceMappingURL=stat-record.js.map

/***/ }),

/***/ 116:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the CategoryDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CategoryDetailPage = (function () {
    function CategoryDetailPage(navCtrl, navParams, viewCtrl, formBuilder) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.formBuilder = formBuilder;
        this.submitAttempt = false;
        var param = this.navParams.get('category');
        if (param == null) {
            // Création
            this.category = {
                'name': ''
            };
            this.title = 'Nouvelle cat&eacute;gorie';
        }
        else {
            // Modification
            this.category = {
                'id': param.id,
                'name': param.name
            };
            this.title = 'Modification de la cat&eacute;gorie';
        }
        this.categoryForm = formBuilder.group({
            name: [this.category.name, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
        });
    }
    CategoryDetailPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad CategoryDetailPage');
    };
    CategoryDetailPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CategoryDetailPage.prototype.save = function () {
        this.submitAttempt = true;
        if (this.categoryForm.valid) {
            this.viewCtrl.dismiss(this.category);
        }
    };
    CategoryDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-category-detail',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\category-detail\category-detail.html"*/'<!--\n\n  Generated template for the CategoryDetailPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span [innerHTML]="title"></span>\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <form [formGroup]="categoryForm">\n\n      <ion-item>\n\n        <ion-input type="text" placeholder="Nom" formControlName="name" [(ngModel)]="category.name"></ion-input>\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!categoryForm.controls.name.valid  && (categoryForm.controls.name.dirty || submitAttempt)">\n\n        <p *ngIf="categoryForm.controls.name.errors.required">Veuillez saisir le nom.</p>\n\n      </div>\n\n    </form>\n\n  </ion-list>\n\n    \n\n  <div padding>\n\n    <button [disabled]="!categoryForm.valid" ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\category-detail\category-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */]])
    ], CategoryDetailPage);
    return CategoryDetailPage;
}());

//# sourceMappingURL=category-detail.js.map

/***/ }),

/***/ 117:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CategoryLinkPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the CategoryLinkPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CategoryLinkPage = (function () {
    function CategoryLinkPage(navCtrl, navParams, formBuilder, backend, util, viewCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.util = util;
        this.viewCtrl = viewCtrl;
        this.submitAttempt = false;
        this.categoriesLinksForm = formBuilder.group({
            year: ['', __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
        });
    }
    CategoryLinkPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        var loading = this.util.loading('Chargement en cours...');
        this.backend.linkCategories().subscribe(function (data) {
            _this.categoriesLinks = data;
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    };
    CategoryLinkPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    CategoryLinkPage.prototype.save = function () {
        this.submitAttempt = true;
        if (this.categoriesLinksForm.valid) {
            this.viewCtrl.dismiss(this.categoriesLinks);
        }
    };
    CategoryLinkPage.prototype.getCategoriesIds = function () {
        return Object.keys(this.categoriesLinks.links);
    };
    CategoryLinkPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-category-link',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\category-link\category-link.html"*/'<!--\n\n  Generated template for the CategoryLinkPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      Rapprochement des cat&eacute;gories\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list *ngIf="categoriesLinks">\n\n    <form [formGroup]="categoriesLinksForm">\n\n      <ion-item>\n\n        <ion-label floating color="primary">Ann&eacute;e</ion-label>\n\n        <ion-input type="number" formControlName="year" [(ngModel)]="categoriesLinks.year"></ion-input >\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!categoriesLinksForm.controls.year.valid && (categoriesLinksForm.controls.year.dirty || submitAttempt)">\n\n        <p *ngIf="categoriesLinksForm.controls.year.errors.required">Veuillez saisir l\'ann&eacute;e.</p>\n\n      </div>\n\n      <ion-item *ngFor="let categoryId of getCategoriesIds()">\n\n        <ion-label>{{util.getCategoryName(categoryId)}}</ion-label>\n\n        <ion-select cancelText="Annuler" okText="OK" placeholder="Cat&eacute;gorie archive" [(ngModel)]="categoriesLinks.links[categoryId]" [ngModelOptions]="{ standalone: true }">\n\n          <ion-option value="-1">Aucune</ion-option>\n\n          <ion-option *ngFor="let archiveCategory of categoriesLinks.archiveCategories" [value]="archiveCategory.id">{{util.getCategoryNameFromList(archiveCategory.id, categoriesLinks.archiveCategories)}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n    </form>\n\n  </ion-list>\n\n\n\n  <div padding>\n\n    <button ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\category-link\category-link.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */], __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */]])
    ], CategoryLinkPage);
    return CategoryLinkPage;
}());

//# sourceMappingURL=category-link.js.map

/***/ }),

/***/ 118:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CommentDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the CommentDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var CommentDetailPage = (function () {
    function CommentDetailPage(navCtrl, navParams, viewCtrl, formBuilder, backend) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.formBuilder = formBuilder;
        this.submitAttempt = false;
        var paramComment = this.navParams.get('comment');
        if (paramComment == null) {
            // Création
            this.comment = {
                'authorId': backend.getIdentifiedUser().id,
                'content': '',
                'nominationId': this.navParams.get('nomination').id
            };
            this.title = 'Nouveau commentaire';
        }
        else {
            // Modification
            this.comment = {
                'id': paramComment.id,
                'authorId': paramComment.authorId,
                'content': paramComment.content,
                'nominationId': paramComment.nominationId
            };
            this.title = 'Modification du commentaire';
        }
        this.commentForm = formBuilder.group({
            content: [this.comment.content, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required]
        });
    }
    CommentDetailPage.prototype.ionViewDidLoad = function () {
    };
    /**
     * Clic sur le bouton de fermeture.
     */
    CommentDetailPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    /**
     * Clic sur le bouton de validation.
     */
    CommentDetailPage.prototype.save = function () {
        this.submitAttempt = true;
        if (this.commentForm.valid) {
            //this.comment['date'] = this.datePipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
            this.viewCtrl.dismiss(this.comment);
        }
    };
    CommentDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-comment-detail',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\comment-detail\comment-detail.html"*/'<!--\n\n  Generated template for the CommentDetailPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      {{title}}\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <form [formGroup]="commentForm">\n\n      <ion-item>\n\n        <ion-textarea placeholder="Commentaire" formControlName="content" [(ngModel)]="comment.content"></ion-textarea>\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!commentForm.controls.content.valid  && (commentForm.controls.content.dirty || submitAttempt)">\n\n        <p *ngIf="commentForm.controls.content.errors.required">Veuillez saisir le commentaire.</p>\n\n      </div>\n\n    </form>\n\n  </ion-list>\n\n    \n\n  <div padding>\n\n    <button [disabled]="!commentForm.valid" ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n</ion-content>'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\comment-detail\comment-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__["a" /* BackendProvider */]])
    ], CommentDetailPage);
    return CommentDetailPage;
}());

//# sourceMappingURL=comment-detail.js.map

/***/ }),

/***/ 119:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NominationDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the NominationDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NominationDetailPage = (function () {
    function NominationDetailPage(navCtrl, navParams, viewCtrl, formBuilder, backend, util) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.formBuilder = formBuilder;
        this.backend = backend;
        this.util = util;
        this.submitAttempt = false;
        this.newImage = null;
        var paramNomination = this.navParams.get('nomination');
        if (paramNomination == null) {
            // Création
            var paramCategory = this.navParams.get('category');
            this.nomination = {
                'reason': '',
                'categoryId': paramCategory.id,
                'imageId': null
            };
            this.title = 'Nouvelle nomination (' + paramCategory.name + ')';
        }
        else {
            // Modification
            this.nomination = {
                'id': paramNomination.id,
                'reason': paramNomination.reason,
                'usersIds': paramNomination.usersIds,
                'categoryId': paramNomination.categoryId,
                'imageId': paramNomination.imageId
            };
            this.title = 'Modification de la nomination';
        }
        this.nominationForm = formBuilder.group({
            reason: [this.nomination.reason, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            usersIds: [this.nomination.usersIds, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            image: null
        });
        this.users = backend.getCachedUsers();
    }
    NominationDetailPage.prototype.ionViewDidLoad = function () {
    };
    /**
     * Clic sur le bouton de fermeture.
     */
    NominationDetailPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    /**
     * Clic sur le bouton de validation.
     */
    NominationDetailPage.prototype.save = function () {
        this.submitAttempt = true;
        if (this.nominationForm.valid) {
            this.viewCtrl.dismiss(this.nomination);
        }
    };
    /**
     * Sélection de l'avatar.
     */
    NominationDetailPage.prototype.onFileChange = function (event) {
        var _this = this;
        var reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            var file_1 = event.target.files[0];
            reader.readAsDataURL(file_1);
            reader.onload = function () {
                if (file_1.size > (1024 * 1024)) {
                    console.log('Image trop volumineuse');
                    _this.util.warning('Fichier trop volumineux', 'La taille du fichier doit &ecirc;tre inférieure à 1 Mo');
                }
                else {
                    _this.newImage = reader.result;
                    var image = reader.result.split(',')[1];
                    /*
                    this.nominationForm.get('image').setValue({
                      filename: file.name,
                      filetype: file.type,
                      value: image
                    });
                    */
                    _this.nomination['image'] = image;
                }
            };
        }
    };
    NominationDetailPage.prototype.getNominationImageURL = function () {
        return this.backend.getNominationImageURL(this.nomination.imageId);
    };
    /**
     * Suppression de l'image.
     */
    NominationDetailPage.prototype.deleteImage = function () {
        this.nomination.imageId = null;
        this.nomination['image'] = null;
        this.newImage = null;
        this.clearFile();
    };
    NominationDetailPage.prototype.clearFile = function () {
        //this.nominationForm.get('image').setValue(null);
        this.fileInput.nativeElement.value = '';
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('fileInput'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], NominationDetailPage.prototype, "fileInput", void 0);
    NominationDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-nomination-detail',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\nomination-detail\nomination-detail.html"*/'<!--\n\n  Generated template for the NominationDetailPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      {{title}}\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n    <form [formGroup]="nominationForm">\n\n      <ion-item>\n\n        <ion-select multiple="true" cancelText="Annuler" okText="OK" placeholder="Comp&eacute;titeurs" formControlName="usersIds" [(ngModel)]="nomination.usersIds">\n\n          <ion-option *ngFor="let user of users" [value]="user.id" >{{this.util.getUserName(user.id)}}</ion-option>\n\n          <!-- [selected]="isUserSelected(user)" -->\n\n        </ion-select>\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!nominationForm.controls.usersIds.valid  && (nominationForm.controls.usersIds.dirty || submitAttempt)">\n\n        <p *ngIf="nominationForm.controls.usersIds.errors.required">Veuillez choisir les comp&eacute;titeurs.</p>\n\n      </div>\n\n      <ion-item>\n\n        <ion-textarea placeholder="Raison" formControlName="reason" [(ngModel)]="nomination.reason"></ion-textarea>\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!nominationForm.controls.reason.valid  && (nominationForm.controls.reason.dirty || submitAttempt)">\n\n        <p *ngIf="nominationForm.controls.reason.errors.required">Veuillez saisir la raison.</p>\n\n      </div>\n\n    </form>\n\n  </ion-list>\n\n  \n\n  <div padding style="padding-top: 0 !important;">\n\n    <!-- Bouton de suppression -->\n\n    <button *ngIf="newImage || nomination.imageId" ion-button icon-only clear color="danger" class="icon-button" (click)="deleteImage()" title="Supprimer l\'image" style="max-width: 30px;">\n\n      <ion-icon name="trash"></ion-icon>\n\n    </button>\n\n    \n\n     <!-- Image -->\n\n    <label for="image" class="label-file">\n\n      <!-- Cas où l\'utilisateur vient de sélectionner une image : on l\'affiche -->\n\n      <img *ngIf="newImage; else no_new" [src]="newImage" alt="Image" />\n\n    \n\n      <!-- Cas où la nomination a une image -->\n\n      <ng-template #no_new>\n\n        <img *ngIf="nomination.imageId; else no_image" [src]="getNominationImageURL()" alt="Image" />        \n\n      </ng-template>\n\n      \n\n      <!-- Cas où la nomination n\'a pas d\'image -->\n\n      <ng-template #no_image>\n\n        <div icon-only class="button button-md button-clear button-clear-md button-clear-md-danger button-inner" style="max-width: 30px;" title="Ajouter une image">\n\n          <ion-icon name="image" class="icon icon-md ion-md-image"></ion-icon>\n\n        </div>\n\n      </ng-template>\n\n      <!--\n\n      <button ion-button icon-only clear color="danger" title="Ajouter une image" style="max-width: 30px; margin-left: 16px;">\n\n        <ion-icon name="image"></ion-icon>\n\n      </button>\n\n      -->\n\n    </label>\n\n    \n\n    <input id="image" class="input-file" type="file" (change)="onFileChange($event)" #fileInput accept="image/*" />\n\n  \n\n    <!-- Bouton de validation -->\n\n    <button [disabled]="!nominationForm.valid" ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n \n\n</ion-content>'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\nomination-detail\nomination-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_util_util__["a" /* UtilProvider */]])
    ], NominationDetailPage);
    return NominationDetailPage;
}());

//# sourceMappingURL=nomination-detail.js.map

/***/ }),

/***/ 120:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ImagePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the ImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var ImagePage = (function () {
    function ImagePage(navCtrl, navParams, backend, util) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.util = util;
        this.nominationsRow = {};
    }
    ImagePage.prototype.ionViewDidLoad = function () {
    };
    ImagePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getImageBundle().subscribe(function (data) {
            _this.bundle = data;
            _this.setNominationsRow(_this.bundle.nominations);
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    };
    ImagePage.prototype.setNominationsRow = function (nominations) {
        this.nominationsRow = {};
        var row = 0;
        for (var i = 0; i < nominations.length; i++) {
            var nominationsOfOneRow = this.nominationsRow[row];
            if (nominationsOfOneRow == null) {
                nominationsOfOneRow = [];
                this.nominationsRow[row] = nominationsOfOneRow;
            }
            nominationsOfOneRow.push(nominations[i]);
            if ((i + 1) % 3 == 0) {
                row++;
            }
        }
    };
    ImagePage.prototype.getRows = function () {
        return Object.keys(this.nominationsRow);
    };
    ImagePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-image',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\image\image.html"*/'<!--\n\n  Generated template for the ImagePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <page-top-header subtitle="Images"></page-top-header>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-grid *ngIf="bundle">\n\n    <ion-row *ngFor="let row of getRows()">\n\n      <ion-col col-4 *ngFor="let nomination of nominationsRow[row]">\n\n        <ion-card>\n\n          <ion-card-header>\n\n            {{util.getCategoryName(nomination.categoryId)}}\n\n          </ion-card-header>\n\n          <img [src]="backend.getImageURL(nomination.imageId)" style="width: initial;" />\n\n          <ion-card-content>\n\n            <p>{{nomination.reason}}</p>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\image\image.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], ImagePage);
    return ImagePage;
}());

//# sourceMappingURL=image.js.map

/***/ }),

/***/ 121:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SettlePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the SettlePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var SettlePage = (function () {
    function SettlePage(navCtrl, navParams, viewCtrl, backend, util) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.backend = backend;
        this.util = util;
        this.categories = this.navParams.get('categories');
        this.winnersByCategory = this.navParams.get('winnersByCategory');
        this.decisionsByCategory = this.navParams.get('decisionsByCategory');
        this.decisions = [];
        for (var _i = 0, _a = this.categories; _i < _a.length; _i++) {
            var categoryId = _a[_i];
            this.decisions.push({
                'categoryId': categoryId,
                'nominatedId': this.decisionsByCategory != null ? this.decisionsByCategory[categoryId] : null
            });
        }
    }
    SettlePage.prototype.ionViewDidLoad = function () {
    };
    SettlePage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    SettlePage.prototype.save = function () {
        this.viewCtrl.dismiss(this.decisions);
    };
    SettlePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-settle',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\settle\settle.html"*/'<!--\n\n  Generated template for the SettlePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      D&eacute;partage des ex aequo\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <button ion-button (click)="dismiss()">\n\n        <ion-icon name="md-close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <ion-list>\n\n      <ion-item *ngFor="let decision of decisions">\n\n        <ion-label>{{util.getCategoryName(decision.categoryId)}}</ion-label>\n\n        <ion-select cancelText="Annuler" okText="OK" placeholder="Comp&eacute;titeur" [(ngModel)]="decision.nominatedId">\n\n          <ion-option value="-2">Tous</ion-option>\n\n          <ion-option *ngFor="let userId of winnersByCategory[decision.categoryId]" [value]="userId">{{util.getUserName(userId)}}</ion-option>\n\n        </ion-select>\n\n      </ion-item>\n\n  </ion-list>\n\n\n\n  <div padding>\n\n    <button ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\settle\settle.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], SettlePage);
    return SettlePage;
}());

//# sourceMappingURL=settle.js.map

/***/ }),

/***/ 122:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NominationPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__category_detail_category_detail__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__nomination_detail_nomination_detail__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__comment_detail_comment_detail__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__image_image__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








/**
 * Generated class for the NominationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var NominationPage = (function () {
    function NominationPage(navCtrl, navParams, backend, modalCtrl, util, events) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.modalCtrl = modalCtrl;
        this.util = util;
        this.shown = {}; // Indique quel blocs de catégorie sont ouverts
        this.nominationsMap = {};
        events.subscribe('nomination:identified', function (callback) {
            // L'utilisateur s'est identifié : on retourne à la création ou l'édition du commentaire
            _this.addComment(null, callback['nomination']);
        });
        events.subscribe('nomination:email', function (data) {
            // L'utilisateur a saisi une adresse e-mail : on retourne à l'envoi des nominations par mail
            _this.sendNominationsByMail(data);
        });
    }
    NominationPage.prototype.ionViewDidLoad = function () {
    };
    NominationPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getNominationBundle().subscribe(function (data) {
            _this.bundle = data;
            // Création de la map des nominations par ID pour accéder facilement aux nominations
            if (_this.bundle.nominations != null) {
                for (var _i = 0, _a = Object.keys(_this.bundle.nominations); _i < _a.length; _i++) {
                    var categoryId = _a[_i];
                    for (var _b = 0, _c = _this.bundle.nominations[categoryId]; _b < _c.length; _b++) {
                        var nomination = _c[_b];
                        _this.nominationsMap[nomination.id] = nomination;
                    }
                }
                // Récupération des commentaires
                _this.getCommentsByNominations();
            }
            else {
                _this.bundle.nominations = {};
                _this.commentsByNominations = {};
            }
            loading.dismiss();
        }, function (error) {
            loading.dismiss();
            _this.util.handleError(error);
        });
    };
    /**
     * Clic sur le bouton d'édition d'une catégorie.
     */
    NominationPage.prototype.editCategory = function (event, category) {
        var _this = this;
        event.stopPropagation();
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__category_detail_category_detail__["a" /* CategoryDetailPage */], { 'category': category });
        modal.onDidDismiss(function (updatedCategory) {
            if (updatedCategory != null) {
                // Fermeture du modal : mise à jour de la catégorie dans la base
                _this.backend.updateCategory(updatedCategory).subscribe(function () {
                    // Mise à jour du cache
                    _this.backend.updateCachedCategory(updatedCategory);
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Clic sur le bouton d'ajout d'une catégorie.
     */
    NominationPage.prototype.addCategory = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__category_detail_category_detail__["a" /* CategoryDetailPage */]);
        modal.onDidDismiss(function (newCategory) {
            if (newCategory != null) {
                // Fermeture du modal : ajout de la catégorie dans la base
                _this.backend.addCategory(newCategory).subscribe(function (data) {
                    // Mise à jour du cache
                    _this.backend.addCachedCategory(data);
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Clic sur le bouton de suppression d'une catégorie.
     */
    NominationPage.prototype.deleteCategory = function (event, category) {
        event.stopPropagation();
        this.util.confirm('Suppression de la catégorie', 'La suppression de la catégorie entraînera la suppression des nominations liées. Etes-vous sûr de vouloir la supprimer ?', this.deleteCategoryBackend.bind(this), category);
    };
    NominationPage.prototype.deleteCategoryBackend = function (category) {
        var _this = this;
        // Suppression de la catégorie dans la base
        this.backend.deleteCategory(category).subscribe(function () {
            // Suppression dans le cache
            _this.backend.deleteCachedCategory(category);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    /**
     * Clic sur l'entête d'une catégorie : on ouvre ou on ferme le bloc.
     */
    NominationPage.prototype.toggleCategory = function (categoryId) {
        if (this.shown[categoryId] == true) {
            this.shown[categoryId] = false;
        }
        else {
            this.shown[categoryId] = true;
        }
    };
    ;
    /**
     * Indique si un bloc de catégorie doit être ouvert.
     */
    NominationPage.prototype.isCategoryShown = function (categoryId) {
        if (this.shown[categoryId] == true) {
            return true;
        }
        return false;
    };
    ;
    /**
     * Ajout d'une nomination.
     */
    NominationPage.prototype.addNomination = function (event, category) {
        var _this = this;
        if (event != null) {
            event.stopPropagation();
        }
        if (this.util.nominationsOpen()) {
            var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__nomination_detail_nomination_detail__["a" /* NominationDetailPage */], { 'category': category });
            modal.onDidDismiss(function (newNomination) {
                if (newNomination != null) {
                    // Fermeture du modal : ajout de la nomination dans la base
                    var loading_1 = _this.util.loading('Enregistrement en cours...');
                    _this.backend.addNomination(newNomination).subscribe(function (data) {
                        loading_1.dismiss();
                        // Ajout de la nomination dans l'IHM
                        _this.util.mapOfListsAdd(_this.bundle.nominations, newNomination.categoryId, data);
                        _this.nominationsMap[data['id']] = data;
                        // Ouverture du bloc
                        _this.shown[newNomination.categoryId] = true;
                    }, function (error) {
                        loading_1.dismiss();
                        _this.util.handleError(error);
                    });
                }
            });
            modal.present();
        }
        else {
            this.util.warning('Nominations', 'Les nominations sont actuellement fermées');
        }
    };
    /**
     * Suppression d'une nomination.
     */
    NominationPage.prototype.deleteNomination = function (event, nomination) {
        var _this = this;
        event.stopPropagation();
        // Suppression de la nomination dans la base
        this.backend.deleteNomination(nomination).subscribe(function () {
            // Mise à jour de l'IHM
            _this.util.mapOfListsDelete(_this.bundle.nominations, nomination.categoryId, nomination.id);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    /**
     * Edition d'une nomination.
     */
    NominationPage.prototype.editNomination = function (nomination) {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_3__nomination_detail_nomination_detail__["a" /* NominationDetailPage */], { 'nomination': nomination });
        modal.onDidDismiss(function (updatedNomination) {
            if (updatedNomination != null) {
                // Fermeture du modal : modification de la nomination dans la base
                var loading_2 = _this.util.loading('Enregistrement en cours...');
                _this.backend.updateNomination(updatedNomination).subscribe(function (data) {
                    loading_2.dismiss();
                    // Mise à jour dans l'IHM
                    _this.util.mapOfListsUpdate(_this.bundle.nominations, nomination.categoryId, data);
                    _this.nominationsMap[updatedNomination.id] = data;
                }, function (error) {
                    loading_2.dismiss();
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Commentaire d'une nomination.
     */
    NominationPage.prototype.addComment = function (event, nomination) {
        var _this = this;
        if (event != null) {
            event.stopPropagation();
        }
        if (this.backend.getIdentifiedUser() == null) {
            // L'utilisateur n'est pas encore identifié : appel de la méthode d'identification puis attente de l'événement signalant l'identification
            this.util.identify('nomination', { 'nomination': nomination });
        }
        else {
            var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__comment_detail_comment_detail__["a" /* CommentDetailPage */], { 'nomination': nomination });
            modal.onDidDismiss(function (newComment) {
                if (newComment != null) {
                    // Fermeture du modal : création du commentaire dans la base
                    _this.backend.addComment(newComment).subscribe(function (data) {
                        // Mise à jour de l'IHM
                        _this.util.mapOfListsAdd(_this.commentsByNominations, nomination.id, data);
                    }, function (error) {
                        _this.util.handleError(error);
                    });
                }
            });
            modal.present();
        }
    };
    /**
     * Récupération des commentaires.
     */
    NominationPage.prototype.getCommentsByNominations = function () {
        var _this = this;
        this.backend.getCommentsByNominations().subscribe(function (data) {
            var bundle = data;
            if (bundle.comments !== null && bundle.comments !== undefined) {
                _this.commentsByNominations = bundle.comments;
            }
            else {
                _this.commentsByNominations = {};
            }
            console.log('commentsByNominations = ' + _this.commentsByNominations);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    /**
     * Récupération des ID des nominations qui ont des commentaires.
     */
    NominationPage.prototype.getCommentedNominationsIds = function () {
        var orderedCommentedNominationsIds = [];
        var commentedNominationsIds = Object.keys(this.commentsByNominations);
        for (var _i = 0, _a = this.backend.getCachedCategories(); _i < _a.length; _i++) {
            var category = _a[_i];
            if (this.bundle.nominations[category.id] != null) {
                for (var _b = 0, _c = this.bundle.nominations[category.id]; _b < _c.length; _b++) {
                    var nomination = _c[_b];
                    if (commentedNominationsIds.indexOf(nomination.id.toString()) != -1) {
                        orderedCommentedNominationsIds.push(nomination.id);
                    }
                }
            }
        }
        return orderedCommentedNominationsIds;
    };
    NominationPage.prototype.getCommentDate = function (comment) {
        return comment.date.substring(0, 10);
    };
    /**
     * Suppression d'un commentaire.
     */
    NominationPage.prototype.deleteComment = function (comment) {
        var _this = this;
        // Suppression du commentaire dans la base
        this.backend.deleteComment(comment).subscribe(function () {
            // Suppression dans l'IHM
            _this.util.mapOfListsDelete(_this.commentsByNominations, comment.nominationId, comment.id);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    /**
     * Edition d'un commentaire.
     */
    NominationPage.prototype.editComment = function (comment) {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__comment_detail_comment_detail__["a" /* CommentDetailPage */], { 'comment': comment });
        modal.onDidDismiss(function (updatedComment) {
            if (updatedComment != null) {
                // Fermeture du modal : mise à jour du commentaire dans la base
                _this.backend.updateComment(updatedComment).subscribe(function (data) {
                    // Mise à jour de l'IHM
                    _this.util.mapOfListsUpdate(_this.commentsByNominations, comment.nominationId, data);
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Indique si le commentaire vient de l'utilisateur qui est identifié (pour décaler le commentaire).
     */
    NominationPage.prototype.isIdentifiedUserComment = function (comment) {
        var user = this.backend.getIdentifiedUser();
        if (user == null) {
            return false;
        }
        return (comment.authorId == user.id);
    };
    /**
     * Clic sur le bouton images : on va vers l'écran des images
     */
    NominationPage.prototype.goToImage = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__image_image__["a" /* ImagePage */]);
    };
    /**
     * Clic sur le bouton mail : on appelle la méthode d'envoi des nominations par mail
     */
    NominationPage.prototype.sendNominationsByMail = function (input) {
        var _this = this;
        var address = null;
        if (input) {
            // L'utilisateur a saisi une adresse
            address = input;
        }
        else {
            var user = this.backend.getIdentifiedUser();
            if (user != null && user.email != null && user.email != '') {
                // L'utilisateur est authentifié et possède une adresse e-mail : on utilise cette adresse
                address = user.email;
            }
        }
        if (address == null) {
            // Si l'utilisateur n'a pas saisi d'adresse et n'est pas authentifié, il doit saisir une adresse
            this.util.getEmail('nomination');
        }
        else {
            // On a une adresse : on envoie
            this.backend.sendNominationsByMail(address).subscribe(function () {
                // Message de confirmation
                _this.util.toast('Le mail a été envoyé');
            }, function (error) {
                _this.util.handleError(error);
            });
        }
    };
    NominationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-nomination',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\nomination\nomination.html"*/'<!--\n\n  Generated template for the NominationPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <page-top-header subtitle="Nominations"></page-top-header>\n\n  <!--\n\n  <ion-toolbar class="subheader">\n\n    <ion-title>Nominations</ion-title>\n\n  </ion-toolbar>\n\n  -->\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <vertical-split-pane primary-component-minsize="150" secondary-component-minsize="100" [secondary-component-toggled-off]="false"\n\n    primary-component-initialratio="0.75">\n\n    \n\n    <!-- Liste des catégories -->\n\n    <div class="split-pane-content-primary">      \n\n      <ion-list no-lines *ngIf="bundle">\n\n        <ion-item *ngFor="let category of backend.getCachedCategories()" text-wrap>\n\n          <!-- Titre du bloc (nom de la catégorie) avec les boutons -->\n\n          <ion-toolbar (click)="toggleCategory(category.id)" class="category-toolbar">\n\n            <h2>\n\n              <ion-icon color="success" item-right [name]="isCategoryShown(category.id) ? \'arrow-dropdown\' : \'arrow-dropright\'" class="chevron"></ion-icon>\n\n              {{category.name}}\n\n            </h2>\n\n            <ion-buttons end>\n\n              <!--\n\n              <button ion-button icon-only color="danger" class="icon-button" (click)="addNomination($event, category)" title="Ajouter une nomination">\n\n                <ion-icon name="add-circle"></ion-icon>\n\n              </button>\n\n              -->\n\n              <button ion-button icon-only color="danger" class="icon-button" (click)="editCategory($event, category)" title="Modifier la cat&eacute;gorie">\n\n                <ion-icon name="create"></ion-icon>\n\n              </button>\n\n              <button ion-button icon-only item-end color="danger" class="icon-button" (click)="deleteCategory($event, category)" title="Supprimer la cat&eacute;gorie">\n\n                <ion-icon name="trash"></ion-icon>\n\n              </button>\n\n            </ion-buttons>\n\n          </ion-toolbar>\n\n          \n\n          <!-- Bloc refermable (nominations de la catégorie) -->\n\n          <div [@expand]="isCategoryShown(category.id)">\n\n            <ng-container *ngIf="bundle.nominations[category.id] != null && bundle.nominations[category.id].length > 0; else empty_content" style="margin-left: 3px;">\n\n              <ion-grid class="nominations-table">\n\n                <!-- Entête -->\n\n                <ion-row class="header">\n\n                  <ion-col class="col-nominees">\n\n                    Nomin&eacute;s\n\n                  </ion-col>\n\n                  <ion-col class="col-reason">\n\n                    Raison\n\n                  </ion-col>\n\n                  <!--<ion-col style="max-width: 47px; text-align: center;">-->\n\n                  <ion-col class="col-action">\n\n                    <button ion-button icon-only clear color="danger" style="margin-left: 32px !important;" class="icon-button inline-icon-button" (click)="addNomination(null, category)" title="Ajouter une nomination">\n\n                      <ion-icon name="add-circle"></ion-icon>\n\n                    </button>\n\n                  </ion-col>\n\n                </ion-row>\n\n                <ion-row *ngFor="let nomination of bundle.nominations[category.id]" class="line" (click)="editNomination(nomination)">\n\n                  <!-- Nominées -->\n\n                  <ion-col class="col-nominees">\n\n                    {{util.getUsersNames(nomination.usersIds)}}\n\n                  </ion-col>\n\n                  <!-- Raison -->\n\n                  <ion-col class="col-reason">\n\n                    {{nomination.reason}}\n\n                  </ion-col>\n\n                  <!-- Boutons -->\n\n                  <ion-col class="col-action">\n\n                    <button ion-button icon-only clear item-end color="danger" class="icon-button inline-icon-button" (click)="addComment($event, nomination)" title="Commenter la nomination">\n\n                      <ion-icon name="text"></ion-icon>\n\n                    </button>\n\n                    <button ion-button icon-only clear item-end color="danger" class="icon-button inline-icon-button" (click)="deleteNomination($event, nomination)" title="Supprimer la nomination">\n\n                      <ion-icon name="trash"></ion-icon>\n\n                    </button>\n\n                  </ion-col>\n\n                </ion-row>\n\n              </ion-grid>\n\n            </ng-container>\n\n\n\n            <!-- Cas où la liste est vide -->\n\n            <ng-template #empty_content>\n\n              <ion-grid class="nominations-table">\n\n                <ion-row class="header">\n\n                  <ion-col>\n\n                    Aucune nomination\n\n                  </ion-col>\n\n                  <ion-col style="max-width: 47px; text-align: center;">\n\n                    <button ion-button icon-only clear color="danger" class="icon-button inline-icon-button" (click)="addNomination(null, category)" title="Ajouter une nomination">\n\n                      <ion-icon name="add-circle"></ion-icon>\n\n                    </button>\n\n                  </ion-col>\n\n                </ion-row>\n\n              </ion-grid>\n\n            </ng-template>\n\n          </div>\n\n          \n\n        </ion-item>\n\n      </ion-list>\n\n    </div>\n\n \n\n    <!-- Commentaires -->\n\n    <div class="split-pane-content-secondary">\n\n      <ng-container *ngIf="commentsByNominations">\n\n        <!-- Parcours des nominations possédant des commentaires -->\n\n        <ion-card *ngFor="let commentedNominationId of getCommentedNominationsIds()">\n\n          <!-- Description de la nomination -->          \n\n          <ion-card-header *ngIf="nominationsMap[commentedNominationId]; else no_nomination" class="comment-header">\n\n            <ion-grid class="nomination-description">\n\n              <ion-row>\n\n                <ion-col>\n\n                  {{util.getUsersNames(nominationsMap[commentedNominationId].usersIds)}} : {{nominationsMap[commentedNominationId].reason}}\n\n                </ion-col>\n\n                <ion-col class="col-action">\n\n                  <button ion-button item-end icon-only clear (click)="addComment(null, nominationsMap[commentedNominationId])" color="danger" class="icon-button inline-icon-button" title="Commenter la nomination">\n\n                    <ion-icon name="text"></ion-icon>\n\n                  </button>\n\n                </ion-col>\n\n              </ion-row>\n\n            </ion-grid>\n\n          </ion-card-header>\n\n          <ng-template #no_nomination>Nomination inexistante {{commentedNominationId}}</ng-template>\n\n            \n\n          <!-- Liste des commentaires -->\n\n          <ion-card-content class="comment-content">\n\n            <div class="message-wrap">\n\n              <div *ngFor="let comment of commentsByNominations[commentedNominationId]" class="message" [ngClass]="{ left: !isIdentifiedUserComment(comment), right: isIdentifiedUserComment(comment) }">\n\n                <page-avatar [userId]="comment.authorId" size="32"></page-avatar>\n\n                <div class="msg-detail">\n\n                  <!-- Contenu de la bulle -->\n\n                  <div class="msg-content" (click)="editComment(comment)">\n\n                    <!--<span class="triangle"></span>-->\n\n                    <p class="line-breaker">{{comment.content}}</p>\n\n                  </div>\n\n                  <!-- Infos sous la bulle -->\n\n                  <div class="msg-info">\n\n                    <p>\n\n                      {{util.getUserName(comment.authorId)}} - {{comment.date.substring(0, 10)}} -\n\n                      <ion-icon name="trash" class="comment-edit" (click)="deleteComment(comment)" title="Supprimer le commentaire"></ion-icon>\n\n                    </p>                       \n\n                  </div>\n\n                </div>\n\n              </div>\n\n            </div>\n\n          </ion-card-content>             \n\n        </ion-card>\n\n      </ng-container>\n\n    </div>\n\n  </vertical-split-pane>\n\n  \n\n  <!-- Bouton d\'ajout -->\'\n\n  <ion-fab right bottom>\n\n    <button ion-fab color="danger"><ion-icon name="arrow-dropup"></ion-icon></button>\n\n    <ion-fab-list side="top">\n\n      <button ion-fab (click)="addCategory()" title="Ajouter une cat&eacute;gorie"><ion-icon name="folder"></ion-icon></button>\n\n      <button ion-fab (click)="goToImage()" title="Voir toutes les images"> <ion-icon name="images"></ion-icon></button>\n\n      <button ion-fab (click)="sendNominationsByMail()" title="Envoyer les nominations par mail"><ion-icon name="mail"></ion-icon></button>\n\n    </ion-fab-list>\n\n    <!--<button ion-fab color="danger" (click)="addCategory()" title="Ajouter une cat&eacute;gorie"><ion-icon name="add"></ion-icon></button>-->\n\n  </ion-fab>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\nomination\nomination.html"*/,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('expand', [
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('true', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ height: '*' })),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('false', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ height: 0 })),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('true => false', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(250)),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('false => true', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(250))
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_6__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_7__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */]])
    ], NominationPage);
    return NominationPage;
}());

//# sourceMappingURL=nomination.js.map

/***/ }),

/***/ 123:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__user_detail_user_detail__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UserPage = (function () {
    function UserPage(navCtrl, navParams, backend, modalCtrl, util) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.modalCtrl = modalCtrl;
        this.util = util;
    }
    UserPage.prototype.ionViewDidLoad = function () {
    };
    UserPage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getUserBundle().subscribe(function (data) {
            _this.bundle = data;
            if (_this.bundle.nominations == null) {
                _this.bundle.nominations = {};
            }
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    };
    /**
     * Modification d'un utilisateur.
     */
    UserPage.prototype.editUser = function (user) {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__user_detail_user_detail__["a" /* UserDetailPage */], { 'user': user, 'nominations': this.bundle.nominations[user.id] });
        modal.onDidDismiss(function (updatedUser) {
            if (updatedUser != null) {
                // Fermeture du modal : mise à jour de l'utilisateur dans la base
                _this.backend.updateUser(updatedUser).subscribe(function (data) {
                    // Mise à jour dans le cache
                    _this.backend.updateCachedUser(data);
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Ajout d'un utilisateur.
     */
    UserPage.prototype.addUser = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_2__user_detail_user_detail__["a" /* UserDetailPage */]);
        modal.onDidDismiss(function (newUser) {
            if (newUser != null) {
                // Fermeture du modal : ajout de l'utilisateur dans la base
                _this.backend.addUser(newUser).subscribe(function (data) {
                    // Mise à jour dans le cache
                    _this.backend.addCachedUser(data);
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    /**
     * Suppression d'un utilisateur.
     */
    UserPage.prototype.deleteUser = function (event, user) {
        event.stopPropagation();
        if (this.backend.getIdentifiedUser() != null && this.backend.getIdentifiedUser().id == user.id) {
            this.util.warning('Suppression du compétiteur', 'Ce compétiteur est actuellement connecté');
        }
        else {
            this.util.confirm('Suppression du compétiteur', 'La suppression du compétiteur entraînera la suppression de ses nominations et de ses votes. Etes-vous sûr de vouloir le supprimer ?', this.deleteUserBackend.bind(this), user);
        }
    };
    UserPage.prototype.deleteUserBackend = function (user) {
        var _this = this;
        // Suppression de l'utilisateur dans la base
        this.backend.deleteUser(user).subscribe(function () {
            // Mise à jour dans le cache
            _this.backend.deleteCachedUser(user);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    UserPage.prototype.getNumberOfNominations = function (user) {
        var nominations = this.bundle.nominations[user.id];
        if (nominations != null) {
            return nominations.length;
        }
        return 0;
    };
    UserPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-user',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\user\user.html"*/'<!--\n\n  Generated template for the UserPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <page-top-header subtitle="Comp&eacute;titeurs"></page-top-header>\n\n  <!--\n\n  <ion-toolbar class="subheader">\n\n    <ion-title>Comp&eacute;titeurs</ion-title>\n\n  </ion-toolbar>\n\n  -->\n\n\n\n</ion-header>\n\n\n\n\n\n<ion-content padding>\n\n  <!-- Liste des utilisateurs -->\n\n  <ion-list *ngIf="bundle">\n\n    <!--\n\n    <ion-item *ngFor="let user of users" (click)="editUser(user)">\n\n      <ion-avatar item-start>\n\n        <img alt="Avatar" [src]="backend.getAvatarURL(5928566696968192)" />\n\n      </ion-avatar>\n\n      <h2>{{user.firstName}} {{user.lastName}}</h2>\n\n      <ion-note class="col-email">{{user.email}}</ion-note>\n\n      <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="deleteUser($event, user)" title="Supprimer le comp&eacute;titeur">\n\n        <ion-icon name="trash"></ion-icon>\n\n      </button>\n\n    </ion-item>\n\n    -->\n\n    \n\n    <button ion-item *ngFor="let user of backend.getCachedUsers()" (click)="editUser(user)">\n\n      <!-- Avatar -->\n\n      <ion-avatar item-start>\n\n        <page-avatar [user]="user" size="45"></page-avatar>\n\n      </ion-avatar>\n\n      \n\n      {{user.firstName}} {{user.lastName}}\n\n      <ion-note class="col-email">{{user.email}}</ion-note>\n\n      <ion-note class="col-nominations" [ngSwitch]="getNumberOfNominations(user)">\n\n        <span *ngSwitchCase="0">Aucune nomination</span>\n\n        <span *ngSwitchCase="1">1 nomination</span>\n\n        <span *ngSwitchDefault>{{getNumberOfNominations(user)}} nominations</span>\n\n      </ion-note>\n\n            \n\n      <button ion-button icon-only clear item-end color="danger" class="icon-button" (click)="deleteUser($event, user)" title="Supprimer le comp&eacute;titeur">\n\n        <ion-icon name="trash"></ion-icon>\n\n      </button>\n\n    </button>\n\n    \n\n  </ion-list>\n\n  \n\n  <!-- Bouton d\'ajout -->\'\n\n  <ion-fab right bottom>\n\n    <button ion-fab color="danger" (click)="addUser()"><ion-icon name="add"></ion-icon></button>\n\n  </ion-fab>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\user\user.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */],
            __WEBPACK_IMPORTED_MODULE_4__providers_util_util__["a" /* UtilProvider */]])
    ], UserPage);
    return UserPage;
}());

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 124:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserDetailPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the UserDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UserDetailPage = (function () {
    function UserDetailPage(navCtrl, navParams, viewCtrl, formBuilder, util, backend) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.viewCtrl = viewCtrl;
        this.formBuilder = formBuilder;
        this.util = util;
        this.backend = backend;
        this.submitAttempt = false;
        this.newImage = null;
        var param = this.navParams.get('user');
        if (param == null) {
            // Création
            this.user = {
                'firstName': '',
                'lastName': '',
                'email': '',
                'avatarId': null
            };
            this.title = 'Nouveau comp&eacute;titeur';
        }
        else {
            // Modification
            this.user = {
                'id': param.id,
                'firstName': param.firstName,
                'lastName': param.lastName,
                'email': param.email,
                'avatarId': param.avatarId
            };
            this.title = 'Modification du comp&eacute;titeur';
            if (this.navParams.get('nominations') != null) {
                this.nominations = this.orderNominations(this.navParams.get('nominations'));
            }
        }
        this.userForm = formBuilder.group({
            firstName: [this.user.firstName, __WEBPACK_IMPORTED_MODULE_2__angular_forms__["f" /* Validators */].required],
            lastName: [this.user.lastName],
            email: [this.user.email],
            avatar: null
        });
    }
    UserDetailPage.prototype.ionViewDidLoad = function () {
    };
    UserDetailPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    UserDetailPage.prototype.save = function () {
        this.submitAttempt = true;
        if (this.userForm.valid) {
            this.viewCtrl.dismiss(this.user);
        }
    };
    /**
     * Sélection de l'avatar.
     */
    UserDetailPage.prototype.onFileChange = function (event) {
        var _this = this;
        var reader = new FileReader();
        if (event.target.files && event.target.files.length > 0) {
            var file = event.target.files[0];
            reader.readAsDataURL(file);
            reader.onload = function () {
                _this.newImage = reader.result;
                var image = reader.result.split(',')[1];
                /*
                this.userForm.get('avatar').setValue({
                  filename: file.name,
                  filetype: file.type,
                  value: image
                });
                */
                _this.user['avatar'] = image;
            };
        }
    };
    /**
     * Suppression de l'avatar.
     */
    UserDetailPage.prototype.deleteAvatar = function () {
        this.user.avatarId = null;
        this.newImage = null;
        this.clearFile();
    };
    UserDetailPage.prototype.clearFile = function () {
        //this.userForm.get('avatar').setValue(null);
        this.fileInput.nativeElement.value = '';
    };
    UserDetailPage.prototype.goToStats = function () {
        this.viewCtrl.dismiss({ 'stats': true });
    };
    UserDetailPage.prototype.orderNominations = function (nominations) {
        var orderedNominations = [];
        for (var _i = 0, _a = this.backend.getCachedCategories(); _i < _a.length; _i++) {
            var category = _a[_i];
            for (var _b = 0, nominations_1 = nominations; _b < nominations_1.length; _b++) {
                var nomination = nominations_1[_b];
                if (nomination.categoryId == category.id) {
                    orderedNominations.push(nomination);
                }
            }
        }
        return orderedNominations;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])('fileInput'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"])
    ], UserDetailPage.prototype, "fileInput", void 0);
    UserDetailPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-user-detail',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\user-detail\user-detail.html"*/'<!--\n\n  Generated template for the UserDetailPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n\n\n  <ion-toolbar>\n\n    <ion-title>\n\n      <span [innerHTML]="title"></span>\n\n    </ion-title>\n\n    <ion-buttons start>\n\n      <!--\n\n      <div ion-button (click)="goToStats()" title="Statistiques">\n\n        <ion-icon name="stats"></ion-icon>\n\n      </div>\n\n      -->\n\n      <button ion-button (click)="dismiss()" title="Fermer">\n\n        <ion-icon name="close"></ion-icon>\n\n      </button>\n\n    </ion-buttons>\n\n  </ion-toolbar>\n\n\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <!-- Avatar -->\n\n  <div class="avatar-button">\n\n    <!-- Bouton de suppression -->\n\n    <button ion-button icon-only clear color="danger" class="icon-button" (click)="deleteAvatar()" title="Supprimer l\'avatar">\n\n      <ion-icon name="trash" style="padding: 0 2px !important"></ion-icon>\n\n    </button>\n\n    \n\n    <!-- Image -->\n\n    <label for="avatar" class="label-file">\n\n      <!-- Cas où l\'utilisateur vient de sélectionner une image : on l\'affiche -->\n\n      <img *ngIf="newImage; else no_new" class="new-img" [src]="newImage" alt="Avatar" />\n\n    \n\n      <!-- Sinon on affiche l\'avatar -->\n\n      <ng-template #no_new><page-avatar [user]="user" size="45"></page-avatar></ng-template>\n\n    </label>\n\n    \n\n    <input id="avatar" class="input-file" type="file" (change)="onFileChange($event)" #fileInput accept="image/*" />\n\n    <!-- <button type="button" class="btn btn-sm btn-default" (click)="clearFile()">clear file</button> -->\n\n  </div>\n\n  \n\n  <ion-list>\n\n    <form [formGroup]="userForm">\n\n      <ion-item>\n\n        <ion-input type="text" placeholder="Pr&eacute;nom" formControlName="firstName" [(ngModel)]="user.firstName"></ion-input>\n\n      </ion-item>\n\n      <div class="valid-error" *ngIf="!userForm.controls.firstName.valid && (userForm.controls.firstName.dirty || submitAttempt)">\n\n        <p *ngIf="userForm.controls.firstName.errors.required">Veuillez saisir le pr&eacute;nom.</p>\n\n      </div>\n\n      \n\n      <ion-item>\n\n        <ion-input type="text" placeholder="Nom" formControlName="lastName" [(ngModel)]="user.lastName"></ion-input>\n\n      </ion-item>\n\n      \n\n      <ion-item>\n\n        <ion-input type="text" placeholder="E-mail" formControlName="email" [(ngModel)]="user.email"></ion-input>\n\n      </ion-item>\n\n    </form>\n\n  </ion-list>\n\n    \n\n  <div padding>\n\n    <button [disabled]="!userForm.valid" ion-button color="primary" block (click)="save()">Valider</button>\n\n  </div>\n\n  \n\n  <ion-grid *ngIf="nominations" class="nominations-table">\n\n    <!-- Entête -->\n\n    <ion-row class="header">\n\n      <ion-col class="col-nominees">\n\n        Cat&eacute;gorie\n\n      </ion-col>\n\n      <ion-col class="col-reason">\n\n        Nomination\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row *ngFor="let nomination of nominations" class="line">\n\n      <!-- Catégorie -->\n\n      <ion-col class="col-nominees">\n\n        {{util.getCategoryName(nomination.categoryId)}}\n\n      </ion-col>\n\n      <!-- Nomination -->\n\n      <ion-col class="col-reason">\n\n        {{nomination.reason}}\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\user-detail\user-detail.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ViewController */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["a" /* FormBuilder */],
            __WEBPACK_IMPORTED_MODULE_4__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_backend_backend__["a" /* BackendProvider */]])
    ], UserDetailPage);
    return UserDetailPage;
}());

//# sourceMappingURL=user-detail.js.map

/***/ }),

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VotePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vote_result_vote_result__ = __webpack_require__(126);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the VotePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VotePage = (function () {
    function VotePage(navCtrl, navParams, backend, util, events) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.util = util;
        this.shown = {};
        events.subscribe('vote:identified', function () {
            // L'utilisateur s'est identifié
            _this.loadVotes();
        });
    }
    VotePage.prototype.ionViewDidLoad = function () {
    };
    VotePage.prototype.ionViewDidEnter = function () {
        this.loaded = false;
        if (this.util.votesOpen()) {
            if (this.backend.getIdentifiedUser() == null) {
                // L'utilisateur n'est pas encore identifié : appel de la méthode d'identification puis attente de l'événement signalant l'identification
                this.util.identify('vote');
            }
            else {
                this.loadVotes();
            }
        }
        else {
            this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_4__vote_result_vote_result__["a" /* VoteResultPage */]);
        }
    };
    VotePage.prototype.loadVotes = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getNominationBundle().subscribe(function (data) {
            _this.bundle = data;
            _this.backend.getVotesByUser(_this.backend.getIdentifiedUser().id).subscribe(function (data2) {
                _this.votesOfUser = data2['votes'];
                console.log('votes : ' + JSON.stringify(_this.votesOfUser));
                _this.initVotes();
                _this.loaded = true;
                loading.dismiss();
            }, function (error) {
                loading.dismiss();
                _this.util.handleError(error);
            });
        }, function (error) {
            loading.dismiss();
            _this.util.handleError(error);
        });
    };
    /**
     * Clic sur l'entête d'une catégorie : on ouvre ou on ferme le bloc.
     */
    VotePage.prototype.toggleCategory = function (categoryId) {
        if (this.shown[categoryId] == true) {
            this.shown[categoryId] = false;
        }
        else {
            this.shown[categoryId] = true;
        }
    };
    ;
    /**
     * Indique si un bloc de catégorie doit être ouvert.
     */
    VotePage.prototype.isCategoryShown = function (categoryId) {
        if (this.shown[categoryId] == true) {
            return true;
        }
        return false;
    };
    ;
    /**
     * Prépare la liste des objets vote avec les votes éventuels de l'utilisateur.
     */
    VotePage.prototype.initVotes = function () {
        this.votes = [];
        this.dirty = false;
        for (var _i = 0, _a = this.backend.getCachedCategories(); _i < _a.length; _i++) {
            var category = _a[_i];
            var nominationsOfOneCategory = this.bundle.nominations[category.id];
            if (nominationsOfOneCategory != null && nominationsOfOneCategory.length > 0) {
                // On ouvre le premier bloc
                if (this.votes.length == 0) {
                    this.shown[category.id] = true;
                }
                else {
                    this.shown[category.id] = false;
                }
                var userVoteByCategory = this.getUserVoteByCategory(category.id);
                if (userVoteByCategory != null) {
                    this.votes.push(userVoteByCategory);
                }
                else {
                    this.votes.push({
                        'categoryId': category.id,
                        'voterId': this.backend.getIdentifiedUser().id,
                        'nominationId': null,
                        'reason': ''
                    });
                }
            }
        }
    };
    VotePage.prototype.getUserVoteByCategory = function (categoryId) {
        if (this.votesOfUser != null) {
            for (var _i = 0, _a = this.votesOfUser; _i < _a.length; _i++) {
                var vote = _a[_i];
                if (vote.categoryId == categoryId) {
                    return vote;
                }
            }
        }
        return null;
    };
    VotePage.prototype.save = function () {
        var _this = this;
        var nonNullVotes = [];
        for (var _i = 0, _a = this.votes; _i < _a.length; _i++) {
            var vote = _a[_i];
            if (vote.nominationId != null) {
                nonNullVotes.push(vote);
            }
        }
        this.backend.addVotes(nonNullVotes).subscribe(function () {
            _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__vote_result_vote_result__["a" /* VoteResultPage */]);
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    VotePage.prototype.result = function () {
        if (this.dirty == true) {
            this.util.confirm('Modification des votes', 'Vous avez effectué des modifications à vos votes. Etes-vous sûr de vouloir abandonner vos modifications ?', this.goToVoteResult.bind(this), null);
        }
        else {
            this.goToVoteResult();
        }
    };
    VotePage.prototype.goToVoteResult = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__vote_result_vote_result__["a" /* VoteResultPage */]);
    };
    /**
     * Clic sur le bouton "Suivant" : on ferme le bloc courant et on ouvre le suivant.
     */
    VotePage.prototype.next = function (index) {
        if (index < (this.votes.length - 1)) {
            this.shown[this.votes[index].categoryId] = false;
            this.shown[this.votes[index + 1].categoryId] = true;
        }
    };
    VotePage.prototype.valueChanged = function () {
        this.dirty = true;
    };
    VotePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-vote',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\vote\vote.html"*/'<!--\n\n  Generated template for the VotePage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <page-top-header subtitle="Votes"></page-top-header>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ng-container *ngIf="loaded">\n\n    <ion-list no-lines>\n\n        <ion-item *ngFor="let vote of votes; let i = index" text-wrap>\n\n          <ion-toolbar (click)="toggleCategory(vote.categoryId)" class="category-toolbar">\n\n            <h2>\n\n              <ion-icon color="success" item-right [name]="isCategoryShown(vote.categoryId) ? \'arrow-dropdown\' : \'arrow-dropright\'" class="chevron"></ion-icon>\n\n              {{util.getCategoryName(vote.categoryId)}}\n\n            </h2>\n\n          </ion-toolbar>\n\n        \n\n          <div [@expand]="isCategoryShown(vote.categoryId)">\n\n            <ion-list style="margin: -1px 0 0 10px !important;">\n\n              <!-- Nominations de la catégorie -->\n\n              <ion-item>\n\n                <mat-radio-group class="vote-radio-group" [(ngModel)]="vote.nominationId" (change)="valueChanged()">\n\n                  <mat-radio-button class="vote-radio-button" *ngFor="let nomination of bundle.nominations[vote.categoryId]" [value]="nomination.id">\n\n                    {{util.getUsersNames(nomination.usersIds)}} ({{nomination.reason}})\n\n                  </mat-radio-button>\n\n                </mat-radio-group>\n\n              </ion-item>\n\n              <!-- Raison -->\n\n              <ion-item>\n\n                <ion-input [(ngModel)]="vote.reason" type="text" placeholder="Raison" (ionChange)="valueChanged()"></ion-input>\n\n              </ion-item>\n\n              <ion-item *ngIf="i < (votes.length - 1)" style="min-height: initial !important;">\n\n                <span class="next" (click)="next(i)">Cat&eacute;gorie suivante</span>\n\n              </ion-item>            \n\n            </ion-list>\n\n          </div>\n\n        </ion-item>\n\n    </ion-list>\n\n    \n\n    <div padding>\n\n      <button ion-button color="primary" (click)="save()">Valider</button>\n\n      <button ion-button color="primary" (click)="result()">Voir les r&eacute;sultats</button>\n\n    </div>\n\n  </ng-container>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\vote\vote.html"*/,
            animations: [
                Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["trigger"])('expand', [
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('true', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ height: '*' })),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["state"])('false', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["style"])({ height: 0 })),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('true => false', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(250)),
                    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["transition"])('false => true', Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["animate"])(250))
                ])
            ]
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* Events */]])
    ], VotePage);
    return VotePage;
}());

//# sourceMappingURL=vote.js.map

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VoteResultPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__settle_settle__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__category_link_category_link__ = __webpack_require__(117);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






/**
 * Generated class for the VoteResultPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var VoteResultPage = (function () {
    function VoteResultPage(navCtrl, navParams, backend, util, modalCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
        this.util = util;
        this.modalCtrl = modalCtrl;
    }
    VoteResultPage.prototype.ionViewDidLoad = function () {
    };
    VoteResultPage.prototype.ionViewDidEnter = function () {
        this.loaded = false;
        this.loadVoteResult();
    };
    VoteResultPage.prototype.loadVoteResult = function () {
        var _this = this;
        // Spinner de chargement    
        var loading = this.util.loading('Chargement en cours...');
        // Appel du backend
        this.backend.getVoteResult().subscribe(function (data) {
            _this.result = data;
            if (_this.result != null) {
                // Recherche des catégories à départager (plus d'un vainqueur)
                _this.categoriesToSettle = [];
                _this.categoriesNotSettled = [];
                for (var _i = 0, _a = _this.backend.getCachedCategories(); _i < _a.length; _i++) {
                    var category = _a[_i];
                    if (_this.result.winnersByCategory[category.id] != null && _this.result.winnersByCategory[category.id].length > 1) {
                        _this.categoriesToSettle.push(category.id);
                        // S'il n'y a pas eu de décision, il faut l'afficher
                        if (_this.result.decisionsByCategory == null || _this.result.decisionsByCategory[category.id] == null) {
                            _this.categoriesNotSettled.push(category.id);
                        }
                    }
                }
            }
            _this.loaded = true;
            loading.dismiss();
        }, function (error) {
            loading.dismiss();
            _this.util.handleError(error);
        });
    };
    /**
     * Ouvre la popup de départage des ex aequo.
     */
    VoteResultPage.prototype.settle = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_4__settle_settle__["a" /* SettlePage */], { 'categories': this.categoriesToSettle, 'winnersByCategory': this.result.winnersByCategory, 'decisionsByCategory': this.result.decisionsByCategory });
        modal.onDidDismiss(function (decisions) {
            if (decisions != null) {
                // Fermeture du modal : mise à jour de l'utilisateur dans la base
                _this.backend.addDecisions(decisions).subscribe(function () {
                    // Mise à jour de l'IHM
                    _this.loadVoteResult();
                }, function (error) {
                    _this.util.handleError(error);
                });
            }
        });
        modal.present();
    };
    VoteResultPage.prototype.getRankingKeys = function () {
        return Object.keys(this.result.ranking);
    };
    VoteResultPage.prototype.archive = function () {
        var _this = this;
        var modal = this.modalCtrl.create(__WEBPACK_IMPORTED_MODULE_5__category_link_category_link__["a" /* CategoryLinkPage */]);
        modal.onDidDismiss(function (categoriesLinks) {
            // Fermeture du modal des liens entre les catégories : on crée l'archive 
            _this.backend.createArchiveFromVoteResult(categoriesLinks).subscribe(function () {
                _this.util.toast("Archive créée");
            }, function (error) {
                _this.util.handleError(error);
            });
        });
        modal.present();
    };
    VoteResultPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-vote-result',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\vote-result\vote-result.html"*/'<!--\n\n  Generated template for the VoteResultPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n<ion-header>\n\n  <page-top-header subtitle="Votes"></page-top-header>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ng-container *ngIf="loaded">\n\n    <ng-container *ngIf="result; else no_vote">\n\n      <ion-list>\n\n        <!-- Parcours des catégories -->\n\n        <ng-container *ngFor="let category of backend.getCachedCategories()">\n\n          <ion-item *ngIf="result.votesByCategory[category.id] != null && result.votesByCategory[category.id].length > 0">\n\n            <b>Cat&eacute;gorie {{util.getCategoryName(category.id)}}</b>\n\n            <!-- Liste des votes -->\n\n            <ul>\n\n              <li *ngFor="let vote of result.votesByCategory[category.id]">\n\n                {{util.getUserName(vote.voterId)}} vote pour {{util.getUsersNames(result.nominationsById[vote.nominationId].usersIds)}}\n\n                ({{result.nominationsById[vote.nominationId].reason}})<br />\n\n                Raison : {{vote.reason}}\n\n              </li>\n\n            </ul>\n\n            <!-- Résultat -->\n\n            <b>R&eacute;sultat :</b>\n\n            <ng-container [ngSwitch]="result.winnersByCategory[category.id].length">\n\n              <ng-container *ngSwitchCase="0">Aucun vote</ng-container>\n\n              <ng-container *ngSwitchCase="1">{{util.getUsersNames(result.winnersByCategory[category.id])}}</ng-container>\n\n              <ng-container *ngSwitchDefault>\n\n                <!-- Ex aequo -->\n\n                ex aequo entre {{util.getUsersNames(result.winnersByCategory[category.id])}}\n\n              </ng-container>\n\n            </ng-container>\n\n            <!-- Les deuxièmes -->\n\n            <ng-container *ngIf="result.secondsByCategory != null && result.secondsByCategory[category.id] != null">\n\n              (suivi par {{util.getUsersNames(result.secondsByCategory[category.id])}})\n\n            </ng-container>        \n\n            <!-- Décision du président -->\n\n            <div *ngIf="result.decisionsByCategory != null && result.decisionsByCategory[category.id] != null">\n\n              <b>D&eacute;cision du pr&eacute;sident :</b>\n\n              <ng-container [ngSwitch]="result.decisionsByCategory[category.id]">\n\n                <ng-container *ngSwitchCase="-2">Tous</ng-container>\n\n                <ng-container *ngSwitchDefault>{{util.getUserName(result.decisionsByCategory[category.id])}}</ng-container>\n\n              </ng-container>\n\n            </div>\n\n          </ion-item>\n\n        </ng-container>\n\n        <!-- Losers de l\'année\' --> \n\n        <ion-item>\n\n          <ng-container [ngSwitch]="result.losers.length">\n\n            <ng-container *ngSwitchCase="0">Aucun vainqueur pour le moment</ng-container>\n\n            <ng-container *ngSwitchCase="1">Le loser de l\'ann&eacute;e est {{util.getUsersNames(result.losers)}} avec {{result.nbAwardsByUser[result.losers[0]]}} r&eacute;compenses</ng-container>\n\n            <ng-container *ngSwitchDefault>\n\n              Les losers de l\'ann&eacute;e sont {{util.getUsersNames(result.losers)}} avec {{result.nbAwardsByUser[result.losers[0]]}} r&eacute;compenses\n\n            </ng-container>\n\n          </ng-container>\n\n          <ng-container *ngIf="categoriesNotSettled && categoriesNotSettled.length > 0; else no_settle">\n\n            mais il reste des ex aequo dans les cat&eacute;gories {{util.getCategoriesNames(categoriesNotSettled)}}.  \n\n          </ng-container>\n\n          <ng-template #no_settle>\n\n            <!-- Pas de catégories à départager, s\'il y a eu des ex aequo chez les losers de l\'année, on annonce le grand loser -->\n\n            <ng-container *ngIf="result.grandLosers">\n\n              <ng-container [ngSwitch]="result.grandLosers.length">\n\n                <ng-container *ngSwitchCase="1">et le Grand Loser est</ng-container> \n\n                <ng-container *ngSwitchDefault>et les Grands Losers sont</ng-container>\n\n              </ng-container>\n\n              {{util.getUsersNames(result.grandLosers)}}\n\n              (avec un total de {{result.grandLosersNbVotes}} votes).\n\n            </ng-container>      \n\n          </ng-template>\n\n          <!-- Classement complet -->\n\n          <ul>\n\n            <ng-container *ngFor="let rank of getRankingKeys()">\n\n              <li *ngIf="rank != 1">\n\n                <!-- Deuxième position : Thierry et Sophie (2 récompenses) -->\n\n                {{util.getOrdinal(rank)}} :\n\n                {{util.getUsersNames(result.ranking[rank])}}\n\n                ({{util.getPlural(result.nbAwardsByUser[result.ranking[rank][0]], "r&eacute;compense")}})\n\n              </li>\n\n            </ng-container>\n\n          </ul>\n\n        </ion-item>\n\n      </ion-list>\n\n      <div padding>\n\n        <button *ngIf="categoriesToSettle && categoriesToSettle.length > 0" ion-button color="primary" (click)="settle()">D&eacute;partager les ex aequo</button>\n\n        <button *ngIf="backend.isAdminConnected()" ion-button color="primary" (click)="archive()">Cr&eacute;er une archive</button>\n\n      </div>\n\n    </ng-container>\n\n    <ng-template #no_vote>\n\n      Aucun vote pour l\'instant.\n\n    </ng-template>\n\n  </ng-container>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\vote-result\vote-result.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */]])
    ], VoteResultPage);
    return VoteResultPage;
}());

//# sourceMappingURL=vote-result.js.map

/***/ }),

/***/ 13:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UtilProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__backend_backend__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/*
  Generated class for the UtilProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var UtilProvider = (function () {
    function UtilProvider(http, alertCtrl, backend, events, loadingCtrl, toastCtrl) {
        this.http = http;
        this.alertCtrl = alertCtrl;
        this.backend = backend;
        this.events = events;
        this.loadingCtrl = loadingCtrl;
        this.toastCtrl = toastCtrl;
        this.KEY_SHOW_LASTNAME = 'SHOW_LASTNAME';
        this.KEY_NOMINATIONS_OPEN = 'NOMINATIONS_OPEN';
        this.KEY_VOTES_OPEN = 'VOTES_OPEN';
        this.KEY_NEWS = 'NEWS';
    }
    UtilProvider.prototype.handleError = function (error) {
        console.log('Erreur : ' + JSON.stringify(error));
        var alert = this.alertCtrl.create({
            title: 'Erreur',
            message: error.message,
            buttons: ['OK']
        });
        alert.present();
    };
    UtilProvider.prototype.getDisplayName = function (user) {
        var showLastname = this.getGlobalByKey(this.KEY_SHOW_LASTNAME);
        if (showLastname != null && showLastname.value != null && showLastname.value.toUpperCase() == 'TRUE' && user.lastName != null && user.lastName != '') {
            return user.firstName + ' ' + user.lastName;
        }
        return user.firstName;
    };
    UtilProvider.prototype.getUserName = function (userId) {
        for (var _i = 0, _a = this.backend.getCachedUsers(); _i < _a.length; _i++) {
            var user = _a[_i];
            if (userId == user.id) {
                return this.getDisplayName(user);
            }
        }
        return '';
    };
    UtilProvider.prototype.getUserNameFromList = function (userId, users) {
        for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
            var user = users_1[_i];
            if (userId == user.id) {
                return this.getDisplayName(user);
            }
        }
        return '';
    };
    UtilProvider.prototype.getUsersNamesFromList = function (usersIds, users) {
        if (usersIds == null) {
            return '';
        }
        var names = [];
        for (var _i = 0, users_2 = users; _i < users_2.length; _i++) {
            var user = users_2[_i];
            if (usersIds.indexOf(user.id) != -1) {
                names.push(this.getDisplayName(user));
            }
        }
        var result = names.join(', ');
        var index = result.lastIndexOf(',');
        if (index != -1) {
            result = result.substring(0, index) + ' et ' + result.substring(index + 2);
        }
        return result;
    };
    UtilProvider.prototype.getGlobalByKey = function (key) {
        for (var _i = 0, _a = this.backend.getCachedGlobals(); _i < _a.length; _i++) {
            var global = _a[_i];
            if (key == global.key) {
                return global;
            }
        }
        return null;
    };
    UtilProvider.prototype.nominationsOpen = function () {
        var global = this.getGlobalByKey(this.KEY_NOMINATIONS_OPEN);
        return (global != null && global.value != null && global.value.toUpperCase() == 'TRUE');
    };
    UtilProvider.prototype.votesOpen = function () {
        var global = this.getGlobalByKey(this.KEY_VOTES_OPEN);
        return (global != null && global.value != null && global.value.toUpperCase() == 'TRUE');
    };
    UtilProvider.prototype.getNews = function () {
        var global = this.getGlobalByKey(this.KEY_NEWS);
        if (global == null) {
            return null;
        }
        return global.value;
    };
    UtilProvider.prototype.getUsersNames = function (usersIds) {
        return this.getUsersNamesFromList(usersIds, this.backend.getCachedUsers());
    };
    UtilProvider.prototype.getCategoryName = function (categoryId) {
        for (var _i = 0, _a = this.backend.getCachedCategories(); _i < _a.length; _i++) {
            var category = _a[_i];
            if (categoryId == category.id) {
                return category.name;
            }
        }
        return '';
    };
    UtilProvider.prototype.getCategoryNameFromList = function (categoryId, categories) {
        for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
            var category = categories_1[_i];
            if (categoryId == category.id) {
                return category.name;
            }
        }
        return '';
    };
    UtilProvider.prototype.getCategoriesNames = function (categoriesIds) {
        var names = [];
        for (var _i = 0, _a = this.backend.getCachedCategories(); _i < _a.length; _i++) {
            var category = _a[_i];
            if (categoriesIds.indexOf(category.id) != -1) {
                names.push(category.name);
            }
        }
        var result = names.join(', ');
        var index = result.lastIndexOf(',');
        if (index != -1) {
            result = result.substring(0, index) + ' et ' + result.substring(index + 2);
        }
        return result;
    };
    UtilProvider.prototype.identify = function (sender, callback) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Identification',
            enableBackdropDismiss: false,
            buttons: [
                { text: 'OK', handler: function (data) {
                        if (data == null) {
                            return false;
                        }
                        _this.backend.setIdentifiedUser(data);
                        if (sender) {
                            // La méthode a été appelée au préalable d'un commentaire ou d'un vote : il faut retourner à la page appelante
                            _this.events.publish(sender + ':identified', callback);
                        }
                    } }
            ]
        });
        for (var _i = 0, _a = this.backend.getCachedUsers(); _i < _a.length; _i++) {
            var user = _a[_i];
            alert.addInput({
                type: 'radio',
                label: user.firstName + ' ' + user.lastName,
                value: user,
                checked: false
            });
        }
        alert.present();
    };
    UtilProvider.prototype.getEmail = function (sender) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Addresse e-mail',
            inputs: [
                { name: 'email', placeholder: 'E-mail' }
            ],
            buttons: [
                { text: 'Annuler', role: 'cancel' },
                { text: 'OK', handler: function (data) {
                        if (data.email == null || data.email == '') {
                            return false;
                        }
                        if (sender) {
                            _this.events.publish(sender + ':email', data.email);
                        }
                    } }
            ]
        });
        alert.present();
    };
    UtilProvider.prototype.warning = function (title, content) {
        var alert = this.alertCtrl.create({
            title: title,
            message: content,
            buttons: ['OK']
        });
        alert.present();
    };
    UtilProvider.prototype.confirm = function (title, content, callback, param) {
        var confirm = this.alertCtrl.create({
            title: title,
            message: content,
            buttons: [
                { text: 'Non', role: 'cancel' },
                { text: 'Oui', handler: function () { callback(param); } }
            ]
        });
        confirm.present();
    };
    UtilProvider.prototype.getPlural = function (number, word) {
        if (number == null || number <= 1) {
            return number + ' ' + word;
        }
        return number + ' ' + word + 's';
    };
    UtilProvider.prototype.getOrdinal = function (number) {
        switch (parseInt(number)) {
            case 1:
                return "Premier";
            case 2:
                return "Deuxième";
            case 3:
                return "Troisième";
            case 4:
                return "Quatrième";
            case 5:
                return "Cinquième";
            case 6:
                return "Sixième";
            case 7:
                return "Septième";
            case 8:
                return "Huitième";
            case 9:
                return "Neuvième";
            case 10:
                return "Dixième";
        }
        return "";
    };
    UtilProvider.prototype.loading = function (message) {
        var loading = this.loadingCtrl.create({
            content: message
        });
        loading.present();
        return loading;
    };
    /*
    loading(message) {
      let loading = this.loadingCtrl.create({
        spinner: 'hide',
        content: '<img src="assets/imgs/loseawards.png" />',
      });
      loading.present();
      return loading;
    }
    */
    UtilProvider.prototype.toast = function (message) {
        var toast = this.toastCtrl.create({
            message: message,
            duration: 2000,
            position: 'top'
        });
        toast.present();
        return toast;
    };
    UtilProvider.prototype.mapOfListsAdd = function (map, key, element) {
        if (map[key] == null) {
            map[key] = [];
        }
        map[key].push(element);
    };
    UtilProvider.prototype.mapOfListsDelete = function (map, key, id) {
        var elements = map[key];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id == id) {
                elements.splice(i, 1);
                break;
            }
        }
    };
    UtilProvider.prototype.mapOfListsUpdate = function (map, key, element) {
        var elements = map[key];
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].id == element.id) {
                elements[i] = element;
                break;
            }
        }
    };
    UtilProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_3__backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["b" /* Events */],
            __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["l" /* ToastController */]])
    ], UtilProvider);
    return UtilProvider;
}());

//# sourceMappingURL=util.js.map

/***/ }),

/***/ 137:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 137;

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"../pages/archive-detail/archive-detail.module": [
		346,
		17
	],
	"../pages/archive/archive.module": [
		347,
		16
	],
	"../pages/avatar/avatar.module": [
		348,
		15
	],
	"../pages/category-detail/category-detail.module": [
		349,
		14
	],
	"../pages/category-link/category-link.module": [
		350,
		13
	],
	"../pages/comment-detail/comment-detail.module": [
		351,
		12
	],
	"../pages/image/image.module": [
		353,
		11
	],
	"../pages/nomination-detail/nomination-detail.module": [
		352,
		10
	],
	"../pages/nomination/nomination.module": [
		355,
		9
	],
	"../pages/settle/settle.module": [
		354,
		8
	],
	"../pages/stat-category/stat-category.module": [
		357,
		7
	],
	"../pages/stat-record/stat-record.module": [
		356,
		6
	],
	"../pages/stat-user/stat-user.module": [
		358,
		5
	],
	"../pages/top-header/top-header.module": [
		359,
		4
	],
	"../pages/user-detail/user-detail.module": [
		361,
		3
	],
	"../pages/user/user.module": [
		360,
		2
	],
	"../pages/vote-result/vote-result.module": [
		363,
		1
	],
	"../pages/vote/vote.module": [
		362,
		0
	]
};
function webpackAsyncContext(req) {
	var ids = map[req];
	if(!ids)
		return Promise.reject(new Error("Cannot find module '" + req + "'."));
	return __webpack_require__.e(ids[1]).then(function() {
		return __webpack_require__(ids[0]);
	});
};
webpackAsyncContext.keys = function webpackAsyncContextKeys() {
	return Object.keys(map);
};
webpackAsyncContext.id = 181;
module.exports = webpackAsyncContext;

/***/ }),

/***/ 227:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__user_user__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__nomination_nomination__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__home_home__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__vote_vote__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__archive_archive__ = __webpack_require__(112);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var TabsPage = (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_1__user_user__["a" /* UserPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_2__nomination_nomination__["a" /* NominationPage */];
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_4__vote_vote__["a" /* VotePage */];
        this.tab5Root = __WEBPACK_IMPORTED_MODULE_5__archive_archive__["a" /* ArchivePage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="Accueil" tabIcon="home"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="Comp&eacute;titeurs" tabIcon="contacts"></ion-tab>\n\n  <ion-tab [root]="tab3Root" tabTitle="Nominations" tabIcon="list-box"></ion-tab>\n\n  <ion-tab [root]="tab4Root" tabTitle="Votes" tabIcon="podium"></ion-tab>\n\n  <ion-tab [root]="tab5Root" tabTitle="Archives" tabIcon="archive"></ion-tab>\n\n</ion-tabs>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 228:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var HomePage = (function () {
    function HomePage(navCtrl, backend, util, alertCtrl) {
        this.navCtrl = navCtrl;
        this.backend = backend;
        this.util = util;
        this.alertCtrl = alertCtrl;
        this.KEY_SHOW_LASTNAME = "SHOW_LASTNAME";
        this.KEY_NOMINATIONS_OPEN = "NOMINATIONS_OPEN";
        this.KEY_VOTES_OPEN = "VOTES_OPEN";
        this.KEY_VOTERS_IDS = "VOTERS_IDS";
        this.KEY_NEWS = "NEWS";
    }
    HomePage.prototype.ionViewDidLoad = function () {
    };
    HomePage.prototype.ionViewDidEnter = function () {
        var _this = this;
        // Spinner de chargement
        var loading = this.util.loading('Chargement en cours...');
        this.restoreURL = {
            url: '',
            restoreUsers: false,
            restoreCategoriesAndNominations: false,
            restoreUsersAndCategoriesArchive: false,
            restoreArchives: false
        };
        // Appel du backend
        this.backend.getHomeBundle().subscribe(function (data) {
            _this.bundle = data;
            // Mise à jour du cache
            if (_this.bundle.users != null) {
                _this.backend.setCachedUsers(_this.bundle.users);
            }
            else {
                _this.backend.setCachedUsers([]);
            }
            if (_this.bundle.categories != null) {
                _this.backend.setCachedCategories(_this.bundle.categories);
            }
            else {
                _this.backend.setCachedCategories([]);
            }
            if (_this.bundle.globals != null) {
                _this.backend.setCachedGlobals(_this.bundle.globals);
            }
            else {
                _this.backend.setCachedGlobals([]);
            }
            _this.initGlobals();
            _this.news = _this.util.getNews();
            loading.dismiss();
        }, function (error) {
            _this.util.handleError(error);
            loading.dismiss();
        });
    };
    HomePage.prototype.initGlobals = function () {
        this.inputGlobals = [];
        for (var _i = 0, _a = this.backend.getCachedGlobals(); _i < _a.length; _i++) {
            var global = _a[_i];
            switch (global.key) {
                case this.KEY_SHOW_LASTNAME:
                case this.KEY_NOMINATIONS_OPEN:
                case this.KEY_VOTES_OPEN:
                    this.inputGlobals.push({ key: global.key, value: (global.value != null && global.value.toUpperCase() == 'TRUE'), valuesIds: global.valuesIds });
                    break;
                default:
                    this.inputGlobals.push({ key: global.key, value: global.value, valuesIds: global.valuesIds });
            }
        }
    };
    HomePage.prototype.getUsersIds = function () {
        if (this.bundle.statistiques != null) {
            return Object.keys(this.bundle.statistiques);
        }
        return null;
    };
    HomePage.prototype.save = function () {
        var _this = this;
        var changedGlobals = [];
        for (var _i = 0, _a = this.inputGlobals; _i < _a.length; _i++) {
            var inputGlobal = _a[_i];
            var global = this.util.getGlobalByKey(inputGlobal.key);
            if (inputGlobal.value != global.value) {
                switch (inputGlobal.key) {
                    case this.KEY_SHOW_LASTNAME:
                    case this.KEY_NOMINATIONS_OPEN:
                    case this.KEY_VOTES_OPEN:
                        global.value = (inputGlobal.value ? 'TRUE' : 'FALSE');
                        break;
                    default:
                        global.value = inputGlobal.value;
                }
                changedGlobals.push(global);
            }
        }
        if (changedGlobals.length > 0) {
            this.backend.updateGlobals({ globals: changedGlobals }).subscribe(function () {
                _this.util.toast('Sauvegarde effectuée');
            }, function (error) {
                _this.util.handleError(error);
            });
        }
    };
    HomePage.prototype.deleteVotes = function () {
        var _this = this;
        this.backend.deleteVotes().subscribe(function () {
            _this.util.toast('Votes supprimés');
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    HomePage.prototype.reset = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Réinitialisation',
            message: 'Cette action va réinitialiser le site. Etes-vous sûr ?',
            buttons: [
                { text: 'Non', role: 'cancel' },
                { text: 'Oui', handler: function () { _this.backendReset(); } }
            ]
        });
        alert.present();
    };
    HomePage.prototype.clean = function () {
        var _this = this;
        this.backend.clean().subscribe(function () {
            _this.util.toast('Base nettoyée');
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    HomePage.prototype.backendReset = function () {
        var _this = this;
        this.backend.reset().subscribe(function () {
            _this.util.toast('Site réinitialisé');
        }, function (error) {
            _this.util.handleError(error);
        });
    };
    HomePage.prototype.restore = function () {
        var _this = this;
        var loading = this.util.loading('Restauration en cours...');
        this.backend.restoreByURL(this.restoreURL).subscribe(function () {
            loading.dismiss();
        }, function (error) {
            loading.dismiss();
            _this.util.handleError(error);
        });
    };
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-home',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\home\home.html"*/'<ion-header>\n\n  <page-top-header subtitle="Accueil"></page-top-header>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n  <ion-grid *ngIf="bundle">\n\n    <ion-row *ngIf="(news != null) && !(news == \'\')">\n\n      <ion-col>\n\n        <ion-card>\n\n          <ion-card-content style="padding: 13px 16px !important; font-size: 1.6rem;">\n\n            {{news}}\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row>\n\n      <ion-col col-4>\n\n        <ion-card>\n\n          <ion-card-header>\n\n            Derni&egrave;res nominations\n\n          </ion-card-header>\n\n          <ion-card-content style="padding-top: 13px;">\n\n            <ion-list no-lines>\n\n              <ion-item *ngFor="let nomination of bundle.nominations">\n\n                <b>{{util.getUsersNames(nomination.usersIds)}}</b> dans la cat&eacute;gorie "{{util.getCategoryName(nomination.categoryId)}}" ({{nomination.reason}})\n\n              </ion-item>\n\n            </ion-list>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n      <ion-col col-4>\n\n        <ion-card>\n\n          <ion-card-header>\n\n            Statistiques\n\n          </ion-card-header>\n\n          <ion-card-content style="padding-top: 13px;">\n\n            <ion-list no-lines>\n\n              <ion-item *ngFor="let userId of getUsersIds()">\n\n                {{util.getUserName(userId)}} a &eacute;t&eacute; nomin&eacute; {{bundle.statistiques[userId]}} fois\n\n              </ion-item>\n\n              <ion-item>\n\n                <b>Total :</b> {{bundle.totalNominations}} nominations\n\n              </ion-item>\n\n            </ion-list>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n    <ion-row *ngIf="backend.isAdminConnected()">\n\n      <ion-col col-4>\n\n        <ion-card>\n\n          <ion-card-header>\n\n            Administration\n\n          </ion-card-header>\n\n          <ion-card-content style="padding-top: 13px;">\n\n            <ion-list no-lines>\n\n              <ng-container *ngFor="let global of inputGlobals">\n\n                <ng-container [ngSwitch]="global.key">\n\n                  <!-- Format des nom -->\n\n                  <ng-container *ngSwitchCase="KEY_SHOW_LASTNAME">\n\n                    <ion-item>\n\n                      <ion-label>Afficher les noms</ion-label>\n\n                      <ion-toggle [(ngModel)]="global.value"></ion-toggle>\n\n                    </ion-item>\n\n                  </ng-container>\n\n                  <!-- Ouverture des nominations -->\n\n                  <ng-container *ngSwitchCase="KEY_NOMINATIONS_OPEN">\n\n                    <ion-item>\n\n                      <ion-label>Nominations ouverts</ion-label>\n\n                      <ion-toggle [(ngModel)]="global.value"></ion-toggle>\n\n                    </ion-item>\n\n                  </ng-container>\n\n                  <!-- Ouverture des votes -->\n\n                  <ng-container *ngSwitchCase="KEY_VOTES_OPEN">\n\n                    <ion-item>\n\n                      <ion-label>Votes ouverts</ion-label>\n\n                      <ion-toggle [(ngModel)]="global.value"></ion-toggle>\n\n                    </ion-item>\n\n                  </ng-container>\n\n                  <!-- Votants -->\n\n                  <ng-container *ngSwitchCase="KEY_VOTERS_IDS">\n\n                    <ion-item>\n\n                      <ion-label>Ont vot&eacute; : {{util.getUsersNames(global.valuesIds)}}</ion-label>                      \n\n                    </ion-item>\n\n                  </ng-container>\n\n                  <ng-container *ngSwitchCase="KEY_NEWS">\n\n                    <ion-item>\n\n                      <ion-input [(ngModel)]="global.value" type="text" placeholder="Actualit&eacute;s"></ion-input>         \n\n                    </ion-item>\n\n                  </ng-container>\n\n                  <ng-container *ngSwitchDefault>\n\n                    <ion-item>\n\n                      <ion-label>{{global.key}} : {{global.value}}</ion-label>                      \n\n                    </ion-item>\n\n                  </ng-container>                   \n\n                </ng-container>\n\n              </ng-container>\n\n            </ion-list>\n\n            <div padding>\n\n              <button ion-button color="primary" (click)="save()">Valider</button>\n\n              <button ion-button color="primary" (click)="deleteVotes()">Supprimer les votes</button>\n\n              <button ion-button color="primary" (click)="reset()">R&eacute;initialiser</button>\n\n              <button ion-button color="primary" (click)="clean()">Nettoyer</button>\n\n            </div>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n      <ion-col col-4>\n\n        <ion-card>\n\n          <ion-card-header>\n\n            Restauration\n\n          </ion-card-header>\n\n          <ion-card-content style="padding-top: 13px;">\n\n            <ion-list no-lines>\n\n              <ion-item>\n\n                <ion-input [(ngModel)]="restoreURL.url" type="text" placeholder="URL d\'import"></ion-input>         \n\n              </ion-item>\n\n              <ion-item>\n\n                <ion-label>Utilisateurs</ion-label>\n\n                <ion-toggle [(ngModel)]="restoreURL.restoreUsers"></ion-toggle>\n\n              </ion-item>\n\n              <ion-item>\n\n                <ion-label>Cat&eacute;gories et nominations</ion-label>\n\n                <ion-toggle [(ngModel)]="restoreURL.restoreCategoriesAndNominations"></ion-toggle>\n\n              </ion-item>\n\n              <ion-item>\n\n                <ion-label>Utilisateurs et cat&eacute;gories d\'archive</ion-label>\n\n                <ion-toggle [(ngModel)]="restoreURL.restoreUsersAndCategoriesArchive"></ion-toggle>\n\n              </ion-item>\n\n              <ion-item>\n\n                <ion-label>Archives</ion-label>\n\n                <ion-toggle [(ngModel)]="restoreURL.restoreArchives"></ion-toggle>\n\n              </ion-item>\n\n              <div padding>\n\n                <button ion-button color="primary" (click)="restore()">Restaurer</button>\n\n              </div>\n\n            </ion-list>\n\n          </ion-card-content>\n\n        </ion-card>\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 233:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AvatarPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



/**
 * Generated class for the AvatarPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var AvatarPage = (function () {
    //@Output() click = new EventEmitter();
    function AvatarPage(navCtrl, navParams, backend) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.backend = backend;
    }
    Object.defineProperty(AvatarPage.prototype, "userId", {
        set: function (userId) {
            for (var _i = 0, _a = this.backend.getCachedUsers(); _i < _a.length; _i++) {
                var current = _a[_i];
                if (current.id == userId) {
                    this.user = current;
                    break;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    AvatarPage.prototype.ionViewDidLoad = function () {
    };
    AvatarPage.prototype.getAvatarURL = function () {
        return this.backend.getAvatarURL(this.user.avatarId);
    };
    // getAvatarData() {
    //   return this.backend.getAvatar(this.user.avatarId).subscribe(
    //     data => {
    //     },
    //     error => {
    //     });;
    // }
    AvatarPage.prototype.getFontSize = function () {
        var val = Math.round(parseFloat(this.size) * 1.22);
        return val;
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], AvatarPage.prototype, "userId", null);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", Object)
    ], AvatarPage.prototype, "user", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], AvatarPage.prototype, "size", void 0);
    AvatarPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-avatar',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\avatar\avatar.html"*/'<!--\n\n  Generated template for the AvatarPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n\n\n<!--\n\n<img #avatar_img class="user-img" *ngIf="user.avatarId; else no_avatar" alt="Avatar" [src]="getAvatarURL()" [style.height]="size" [style.width]="size" />\n\n<ng-template #no_avatar><img #no_avatar_img class="user-img" alt="Avatar" src="assets/imgs/default-avatar.jpg" [style.height]="size" [style.width]="size" /></ng-template>\n\n-->\n\n\n\n<!--<ion-icon name="contact" style="font-size: 46px;"></ion-icon>-->\n\n<!--<div class="letter">{{user.firstName.substring(0,1)}}</div>-->\n\n\n\n<div style="display: inline !important;">\n\n  <img class="user-img" *ngIf="(user && user.avatarId); else no_avatar" alt="Avatar" [src]="getAvatarURL()" [ngStyle]="{ \'height\' : size + \'px\', \'width\' : size + \'px\'}"/>\n\n  <ng-template #no_avatar>\n\n    <ion-icon name="contact" [ngStyle]="{ \'font-size\' : getFontSize() + \'px\', \'line-height\' : size + \'px\' }" class="user-icon"></ion-icon>\n\n  </ng-template>\n\n</div>'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\avatar\avatar.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */]])
    ], AvatarPage);
    return AvatarPage;
}());

//# sourceMappingURL=avatar.js.map

/***/ }),

/***/ 234:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TopHeaderPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_util_util__ = __webpack_require__(13);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




/**
 * Generated class for the TopHeaderPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var TopHeaderPage = (function () {
    function TopHeaderPage(navCtrl, navParams, alertCtrl, backend, util) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.alertCtrl = alertCtrl;
        this.backend = backend;
        this.util = util;
    }
    TopHeaderPage.prototype.ionViewDidLoad = function () {
    };
    TopHeaderPage.prototype.getIdentifiedUser = function () {
        var identifiedUser = this.backend.getIdentifiedUser();
        if (identifiedUser != null) {
            return identifiedUser.firstName + ' ' + identifiedUser.lastName;
        }
        return '';
    };
    TopHeaderPage.prototype.identify = function () {
        this.util.identify();
    };
    TopHeaderPage.prototype.getPosition = function (i) {
        var position = i * -10;
        return position.toString();
    };
    TopHeaderPage.prototype.getPaddingLeft = function () {
        /*
        let padding = (this.backend.getCachedUsers().length - 1) * 10;
        return padding.toString();
        */
        return "0";
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
        __metadata("design:type", String)
    ], TopHeaderPage.prototype, "subtitle", void 0);
    TopHeaderPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
            selector: 'page-top-header',template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\pages\top-header\top-header.html"*/'<!--\n\n  Generated template for the TopHeaderPage page.\n\n\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n\n  Ionic pages and navigation.\n\n-->\n\n\n\n  <ion-navbar color=\'light-blue\'>\n\n    <!--<ion-title>LOSE AWARDS</ion-title>-->\n\n    <!--<div style="margin: auto; text-align: center;" [ngStyle]="{ \'padding-left\' : getPaddingLeft() + \'px\' }">-->\n\n    <div style="margin-left: 30px;">\n\n      <page-avatar *ngFor="let cachedUser of backend.getCachedUsers(); let i = index" [user]="cachedUser" size="60" style="position: relative;" [ngStyle]="{ \'left\' : getPosition(i) + \'px\' }"></page-avatar>\n\n    </div>\n\n    \n\n    <ion-buttons left style="margin-left: 10px;">\n\n      <!--<img alt="Lose awards" src="assets/imgs/loseawards.png" height="32px" style="display: block;"/>-->\n\n      <!--<div style="font-weight: bolder; font-size: 32px; color: red;">LOSE AWARDS</div>-->\n\n      <div style="font-size: 2.4rem; font-weight: 500;">LOSE AWARDS</div>\n\n      <!--<h1>LOSE AWARDS</h1>-->         \n\n      <span [innerHTML]="subtitle"></span>\n\n    </ion-buttons>    \n\n    \n\n    <ion-buttons end style="margin-right: 10px;">\n\n      <span class="identification">{{getIdentifiedUser()}}</span>\n\n      <page-avatar [user]="backend.getIdentifiedUser()" size="32" (click)="identify()" style="cursor: pointer;" title="Identification"></page-avatar>\n\n    </ion-buttons>\n\n  </ion-navbar>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\pages\top-header\top-header.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */], __WEBPACK_IMPORTED_MODULE_2__providers_backend_backend__["a" /* BackendProvider */],
            __WEBPACK_IMPORTED_MODULE_3__providers_util_util__["a" /* UtilProvider */]])
    ], TopHeaderPage);
    return TopHeaderPage;
}());

//# sourceMappingURL=top-header.js.map

/***/ }),

/***/ 235:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(236);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(257);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 257:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__ = __webpack_require__(258);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(303);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_nomination_nomination__ = __webpack_require__(122);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_nomination_detail_nomination_detail__ = __webpack_require__(119);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_user_user__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_user_detail_user_detail__ = __webpack_require__(124);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_category_detail_category_detail__ = __webpack_require__(116);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_home_home__ = __webpack_require__(228);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_tabs_tabs__ = __webpack_require__(227);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_top_header_top_header__ = __webpack_require__(234);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_comment_detail_comment_detail__ = __webpack_require__(118);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_avatar_avatar__ = __webpack_require__(233);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_image_image__ = __webpack_require__(120);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_vote_vote__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_vote_result_vote_result__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_settle_settle__ = __webpack_require__(121);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_archive_archive__ = __webpack_require__(112);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_archive_detail_archive_detail__ = __webpack_require__(111);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_stat_category_stat_category__ = __webpack_require__(113);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_stat_user_stat_user__ = __webpack_require__(114);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_stat_record_stat_record__ = __webpack_require__(115);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_category_link_category_link__ = __webpack_require__(117);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__angular_http__ = __webpack_require__(312);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__angular_common_http__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__providers_backend_backend__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__providers_util_util__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_ng2_split_pane_lib_ng2_split_pane__ = __webpack_require__(313);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31_ng2_split_pane_lib_ng2_split_pane___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_31_ng2_split_pane_lib_ng2_split_pane__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__angular_common__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__angular_material_radio__ = __webpack_require__(318);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34_ng2_dragula__ = __webpack_require__(332);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34_ng2_dragula___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_34_ng2_dragula__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35_angular_highcharts__ = __webpack_require__(83);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




































var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_nomination_nomination__["a" /* NominationPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_nomination_detail_nomination_detail__["a" /* NominationDetailPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_category_detail_category_detail__["a" /* CategoryDetailPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_user_user__["a" /* UserPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_user_detail_user_detail__["a" /* UserDetailPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_top_header_top_header__["a" /* TopHeaderPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_avatar_avatar__["a" /* AvatarPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_comment_detail_comment_detail__["a" /* CommentDetailPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_image_image__["a" /* ImagePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_vote_vote__["a" /* VotePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_vote_result_vote_result__["a" /* VoteResultPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_settle_settle__["a" /* SettlePage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_archive_archive__["a" /* ArchivePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_archive_detail_archive_detail__["a" /* ArchiveDetailPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_stat_category_stat_category__["a" /* StatCategoryPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_stat_user_stat_user__["a" /* StatUserPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_stat_record_stat_record__["a" /* StatRecordPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_category_link_category_link__["a" /* CategoryLinkPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
                __WEBPACK_IMPORTED_MODULE_27__angular_http__["a" /* HttpModule */],
                __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_31_ng2_split_pane_lib_ng2_split_pane__["SplitPaneModule"],
                __WEBPACK_IMPORTED_MODULE_33__angular_material_radio__["a" /* MatRadioModule */],
                __WEBPACK_IMPORTED_MODULE_34_ng2_dragula__["DragulaModule"],
                __WEBPACK_IMPORTED_MODULE_35_angular_highcharts__["b" /* ChartModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                    links: [
                        { loadChildren: '../pages/archive-detail/archive-detail.module#ArchiveDetailPageModule', name: 'ArchiveDetailPage', segment: 'archive-detail', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/archive/archive.module#ArchivePageModule', name: 'ArchivePage', segment: 'archive', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/avatar/avatar.module#AvatarPageModule', name: 'AvatarPage', segment: 'avatar', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/category-detail/category-detail.module#CategoryDetailPageModule', name: 'CategoryDetailPage', segment: 'category-detail', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/category-link/category-link.module#CategoryLinkPageModule', name: 'CategoryLinkPage', segment: 'category-link', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/comment-detail/comment-detail.module#CommentDetailPageModule', name: 'CommentDetailPage', segment: 'comment-detail', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/nomination-detail/nomination-detail.module#NominationDetailPageModule', name: 'NominationDetailPage', segment: 'nomination-detail', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/image/image.module#ImagePageModule', name: 'ImagePage', segment: 'image', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/settle/settle.module#SettlePageModule', name: 'SettlePage', segment: 'settle', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/nomination/nomination.module#NominationPageModule', name: 'NominationPage', segment: 'nomination', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/stat-record/stat-record.module#StatRecordPageModule', name: 'StatRecordPage', segment: 'stat-record', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/stat-category/stat-category.module#StatCategoryPageModule', name: 'StatCategoryPage', segment: 'stat-category', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/stat-user/stat-user.module#StatUserPageModule', name: 'StatUserPage', segment: 'stat-user', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/top-header/top-header.module#TopHeaderPageModule', name: 'TopHeaderPage', segment: 'top-header', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/user/user.module#UserPageModule', name: 'UserPage', segment: 'user', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/user-detail/user-detail.module#UserDetailPageModule', name: 'UserDetailPage', segment: 'user-detail', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/vote/vote.module#VotePageModule', name: 'VotePage', segment: 'vote', priority: 'low', defaultHistory: [] },
                        { loadChildren: '../pages/vote-result/vote-result.module#VoteResultPageModule', name: 'VoteResultPage', segment: 'vote-result', priority: 'low', defaultHistory: [] }
                    ]
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_nomination_nomination__["a" /* NominationPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_nomination_detail_nomination_detail__["a" /* NominationDetailPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_category_detail_category_detail__["a" /* CategoryDetailPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_user_user__["a" /* UserPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_user_detail_user_detail__["a" /* UserDetailPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_11__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_top_header_top_header__["a" /* TopHeaderPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_avatar_avatar__["a" /* AvatarPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_comment_detail_comment_detail__["a" /* CommentDetailPage */],
                __WEBPACK_IMPORTED_MODULE_15__pages_image_image__["a" /* ImagePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_vote_vote__["a" /* VotePage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_vote_result_vote_result__["a" /* VoteResultPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_settle_settle__["a" /* SettlePage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_archive_archive__["a" /* ArchivePage */],
                __WEBPACK_IMPORTED_MODULE_20__pages_archive_detail_archive_detail__["a" /* ArchiveDetailPage */],
                __WEBPACK_IMPORTED_MODULE_21__pages_stat_category_stat_category__["a" /* StatCategoryPage */],
                __WEBPACK_IMPORTED_MODULE_22__pages_stat_user_stat_user__["a" /* StatUserPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_stat_record_stat_record__["a" /* StatRecordPage */],
                __WEBPACK_IMPORTED_MODULE_24__pages_category_link_category_link__["a" /* CategoryLinkPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_25__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_26__ionic_native_splash_screen__["a" /* SplashScreen */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_29__providers_backend_backend__["a" /* BackendProvider */],
                __WEBPACK_IMPORTED_MODULE_28__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_30__providers_util_util__["a" /* UtilProvider */],
                __WEBPACK_IMPORTED_MODULE_32__angular_common__["DatePipe"]
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 303:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(223);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(226);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__ = __webpack_require__(227);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_tabs_tabs__["a" /* TabsPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Development\loseawards\la4-front\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n\n'/*ion-inline-end:"C:\Development\loseawards\la4-front\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 9:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BackendProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


//import 'rxjs/add/operator/map';
/*
  Generated class for the BackendProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
var BackendProvider = (function () {
    function BackendProvider(http) {
        this.http = http;
        this.baseUrl = '';
        console.log('HOST : ' + window.location.hostname);
        if (window.location.hostname == 'localhost') {
            // Test en local
            this.baseUrl = 'http://localhost:8080';
        }
        this.apiUrl = this.baseUrl + '/_ah/api/loseawards/v1';
    }
    // ===== Accueil =====
    BackendProvider.prototype.getHomeBundle = function () {
        return this.http.get(this.apiUrl + '/home/bundle');
    };
    BackendProvider.prototype.reset = function () {
        return this.http.delete(this.apiUrl + '/home/reset');
    };
    BackendProvider.prototype.clean = function () {
        return this.http.get(this.apiUrl + '/home/clean');
    };
    // ===== Utilisateurs =====
    BackendProvider.prototype.getUserBundle = function () {
        return this.http.get(this.apiUrl + '/users/bundle');
    };
    BackendProvider.prototype.getUsers = function () {
        return this.http.get(this.apiUrl + '/users');
    };
    BackendProvider.prototype.addUser = function (user) {
        return this.http.post(this.apiUrl + '/users', user);
    };
    BackendProvider.prototype.updateUser = function (user) {
        return this.http.put(this.apiUrl + '/users/' + user.id, user);
    };
    BackendProvider.prototype.deleteUser = function (user) {
        return this.http.delete(this.apiUrl + '/users/' + user.id);
    };
    // ===== Catégories =====
    BackendProvider.prototype.getCategories = function () {
        return this.http.get(this.apiUrl + '/categories');
    };
    BackendProvider.prototype.addCategory = function (category) {
        return this.http.post(this.apiUrl + '/categories', category);
    };
    BackendProvider.prototype.updateCategory = function (category) {
        return this.http.put(this.apiUrl + '/categories/' + category.id, category);
    };
    BackendProvider.prototype.deleteCategory = function (category) {
        return this.http.delete(this.apiUrl + '/categories/' + category.id);
    };
    // ===== Nominations =====
    BackendProvider.prototype.getNominationBundle = function () {
        return this.http.get(this.apiUrl + '/nominations/bundle');
    };
    BackendProvider.prototype.addNomination = function (nomination) {
        return this.http.post(this.apiUrl + '/nominations', nomination);
    };
    BackendProvider.prototype.deleteNomination = function (nomination) {
        return this.http.delete(this.apiUrl + '/nominations/' + nomination.id);
    };
    BackendProvider.prototype.updateNomination = function (nomination) {
        return this.http.put(this.apiUrl + '/nominations/' + nomination.id, nomination);
    };
    BackendProvider.prototype.getNominationImageURL = function (imageId) {
        return this.baseUrl + '/images/' + imageId;
    };
    BackendProvider.prototype.sendNominationsByMail = function (address) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpParams */]();
        params = params.append('address', address);
        return this.http.get(this.apiUrl + '/nominations/mail', { params: params });
    };
    // ===== Cache et utilisateur identifié
    BackendProvider.prototype.getCachedUsers = function () {
        return this.cachedUsers;
    };
    BackendProvider.prototype.setCachedUsers = function (users) {
        this.cachedUsers = users;
        if (this.identifiedUser != null) {
            for (var _i = 0, _a = this.cachedUsers; _i < _a.length; _i++) {
                var user = _a[_i];
                if (this.identifiedUser.id == user.id) {
                    this.identifiedUser = user;
                    break;
                }
            }
        }
    };
    BackendProvider.prototype.getIdentifiedUser = function () {
        return this.identifiedUser;
    };
    BackendProvider.prototype.setIdentifiedUser = function (user) {
        this.identifiedUser = user;
    };
    BackendProvider.prototype.isAdminConnected = function () {
        if (this.cachedUsers == null || this.cachedUsers.length == 0) {
            // S'il n'y a pas encore d'utilisateur, on est admin
            return true;
        }
        var user = this.getIdentifiedUser();
        return (user != null && user.firstName == 'Thierry');
    };
    BackendProvider.prototype.updateCachedUser = function (user) {
        for (var i = 0; i < this.cachedUsers.length; i++) {
            if (this.cachedUsers[i].id == user.id) {
                this.cachedUsers[i] = user;
                break;
            }
        }
    };
    BackendProvider.prototype.addCachedUser = function (user) {
        var inserted = false;
        for (var i = 0; i < this.cachedUsers.length; i++) {
            if (user.firstName < this.cachedUsers[i].firstName) {
                this.cachedUsers.splice(i, 0, user);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            this.cachedUsers.push(user);
        }
    };
    BackendProvider.prototype.getCachedCategories = function () {
        return this.cachedCategories;
    };
    BackendProvider.prototype.setCachedCategories = function (categories) {
        this.cachedCategories = categories;
    };
    BackendProvider.prototype.deleteCachedUser = function (user) {
        for (var i = 0; i < this.cachedUsers.length; i++) {
            if (this.cachedUsers[i].id == user.id) {
                this.cachedUsers.splice(i, 1);
                break;
            }
        }
    };
    BackendProvider.prototype.updateCachedCategory = function (category) {
        for (var i = 0; i < this.cachedCategories.length; i++) {
            if (this.cachedCategories[i].id == category.id) {
                this.cachedCategories[i] = category;
                break;
            }
        }
    };
    BackendProvider.prototype.addCachedCategory = function (category) {
        var inserted = false;
        for (var i = 0; i < this.cachedCategories.length; i++) {
            if (category.name < this.cachedCategories[i].name) {
                this.cachedCategories.splice(i, 0, category);
                inserted = true;
                break;
            }
        }
        if (!inserted) {
            this.cachedCategories.push(category);
        }
    };
    BackendProvider.prototype.deleteCachedCategory = function (category) {
        for (var i = 0; i < this.cachedCategories.length; i++) {
            if (this.cachedCategories[i].id == category.id) {
                this.cachedCategories.splice(i, 1);
                break;
            }
        }
    };
    // ===== Commentaires =====
    BackendProvider.prototype.getCommentsByNominations = function () {
        return this.http.get(this.apiUrl + '/comments/group');
    };
    BackendProvider.prototype.addComment = function (comment) {
        return this.http.post(this.apiUrl + '/comments', comment);
    };
    BackendProvider.prototype.deleteComment = function (comment) {
        return this.http.delete(this.apiUrl + '/comments/' + comment.id);
    };
    BackendProvider.prototype.updateComment = function (comment) {
        return this.http.put(this.apiUrl + '/comments/' + comment.id, comment);
    };
    // ===== Avatars =====
    BackendProvider.prototype.getAvatarURL = function (avatarId) {
        // return this.apiUrl + '/avatars/' + avatarId;
        return this.baseUrl + '/avatars/' + avatarId;
    };
    BackendProvider.prototype.getAvatar = function (avatarId) {
        return this.http.get(this.apiUrl + '/avatars/' + avatarId);
    };
    // ===== Images =====
    BackendProvider.prototype.getImageBundle = function () {
        return this.http.get(this.apiUrl + '/images/bundle');
    };
    BackendProvider.prototype.getImageURL = function (imageId) {
        return this.apiUrl + '/images/' + imageId;
    };
    // ===== Votes =====
    BackendProvider.prototype.addVotes = function (votes) {
        return this.http.post(this.apiUrl + '/votes/bulk', { 'votes': votes });
    };
    BackendProvider.prototype.getVoteResult = function () {
        return this.http.get(this.apiUrl + '/votes/result');
    };
    BackendProvider.prototype.getVotesByUser = function (userId) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpParams */]();
        params = params.append('userId', userId);
        return this.http.get(this.apiUrl + '/votes', { params: params });
    };
    BackendProvider.prototype.deleteVotes = function () {
        return this.http.delete(this.apiUrl + '/votes');
    };
    BackendProvider.prototype.addDecisions = function (decisions) {
        return this.http.post(this.apiUrl + '/decisions/bulk', { 'decisions': decisions });
    };
    // ===== Variables globales =====
    BackendProvider.prototype.updateGlobal = function (global) {
        return this.http.put(this.apiUrl + '/globals/' + global.id, global);
    };
    BackendProvider.prototype.updateGlobals = function (globals) {
        return this.http.put(this.apiUrl + '/globals/bulk', globals);
    };
    BackendProvider.prototype.getCachedGlobals = function () {
        return this.cachedGlobals;
    };
    BackendProvider.prototype.setCachedGlobals = function (globals) {
        this.cachedGlobals = globals;
    };
    // ===== Archives =====
    BackendProvider.prototype.getArchiveBundle = function () {
        return this.http.get(this.apiUrl + '/archives/bundle');
    };
    BackendProvider.prototype.getArchiveUsers = function () {
        return this.http.get(this.apiUrl + '/archiveusers');
    };
    BackendProvider.prototype.addArchiveUser = function (user) {
        return this.http.post(this.apiUrl + '/archiveusers', user);
    };
    BackendProvider.prototype.updateArchiveUser = function (user) {
        return this.http.put(this.apiUrl + '/archiveusers/' + user.id, user);
    };
    BackendProvider.prototype.deleteArchiveUser = function (user) {
        return this.http.delete(this.apiUrl + '/archiveusers/' + user.id);
    };
    BackendProvider.prototype.getArchiveCategories = function () {
        return this.http.get(this.apiUrl + '/archivecategories');
    };
    BackendProvider.prototype.addArchiveCategory = function (category) {
        return this.http.post(this.apiUrl + '/archivecategories', category);
    };
    BackendProvider.prototype.updateArchiveCategory = function (category) {
        return this.http.put(this.apiUrl + '/archivecategories/' + category.id, category);
    };
    BackendProvider.prototype.deleteArchiveCategory = function (category) {
        return this.http.delete(this.apiUrl + '/archivecategories/' + category.id);
    };
    BackendProvider.prototype.addArchive = function (archive) {
        return this.http.post(this.apiUrl + '/archives', archive);
    };
    BackendProvider.prototype.deleteArchive = function (archive) {
        return this.http.delete(this.apiUrl + '/archives/' + archive.id);
    };
    BackendProvider.prototype.addArchiveWithAwardsAndReport = function (archiveWithAwards) {
        return this.http.post(this.apiUrl + '/archives/awards', archiveWithAwards);
    };
    BackendProvider.prototype.updateArchiveWithAwardsAndReport = function (archiveWithAwards) {
        return this.http.put(this.apiUrl + '/archives/awards/' + archiveWithAwards.archive.id, archiveWithAwards);
    };
    /*
    addArchiveAwards(awards) {
      return this.http.post(this.apiUrl + '/archiveawards/bulk', awards);
    }
    
    getArchiveAwards(year) {
      let params = new HttpParams();
      params = params.append('year', year);
      
      return this.http.get(this.apiUrl + '/archiveawards', { params });
    }
    */
    BackendProvider.prototype.getArchiveAwardsAndReport = function (year) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpParams */]();
        params = params.append('year', year);
        return this.http.get(this.apiUrl + '/archiveawards/report', { params: params });
    };
    BackendProvider.prototype.linkCategories = function () {
        return this.http.get(this.apiUrl + '/archives/categoriesLinks');
    };
    BackendProvider.prototype.createArchiveFromVoteResult = function (categoriesLinks) {
        return this.http.post(this.apiUrl + '/archives/fromVoteResult', categoriesLinks);
    };
    // ===== Statistiques =====
    BackendProvider.prototype.getStatCategory = function (category) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpParams */]();
        params = params.append('categoryId', category.id);
        return this.http.get(this.apiUrl + '/archiveawards/statcategory', { params: params });
    };
    BackendProvider.prototype.getStatCategoryGrandChampion = function () {
        return this.http.get(this.apiUrl + '/archiveawards/statcategory');
    };
    BackendProvider.prototype.getStatUser = function (user) {
        var params = new __WEBPACK_IMPORTED_MODULE_0__angular_common_http__["c" /* HttpParams */]();
        params = params.append('userId', user.id);
        return this.http.get(this.apiUrl + '/archiveawards/statuser', { params: params });
    };
    BackendProvider.prototype.getStatRecords = function () {
        return this.http.get(this.apiUrl + '/archiveawards/statrecords');
    };
    // ===== Imports =====
    BackendProvider.prototype.restoreByURL = function (restoreURL) {
        return this.http.post(this.apiUrl + '/restore/url', restoreURL);
    };
    BackendProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], BackendProvider);
    return BackendProvider;
}());

//# sourceMappingURL=backend.js.map

/***/ })

},[235]);
//# sourceMappingURL=main.js.map