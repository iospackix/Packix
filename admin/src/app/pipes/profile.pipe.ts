import {Pipe, PipeTransform} from '@angular/core';
import {StorageBrowser} from "../shared/sdk/storage/storage.browser";
import {LoopBackAuth} from "../shared/sdk/services/core/auth.service";

@Pipe({
    name: 'profileInfo'
})
export class ProfilePipe implements PipeTransform {

  constructor(private storageBrowser: StorageBrowser, private auth: LoopBackAuth) {
  }

  cacheProfileData() {
    let profileData = this.auth.getCurrentUserData();

    if (profileData) {
      let identities = profileData["identities"];

      if (identities && identities.length > 0) {
        let identityProfile = identities[0]["profile"];

        if (identityProfile) {
          this.cacheDisplayName(identityProfile);
          this.cacheProfilePhoto(identityProfile);
          this.cacheProfileEmail(identityProfile);
        }
      }
    }
  }
  cacheProfilePhoto(identityProfile) {
    let profilePhotos = identityProfile["photos"];
    let profilePhotoURL = '';
    if (profilePhotos && profilePhotos.length > 0) {
      profilePhotoURL = profilePhotos[0]["value"];
    }
    if (!profilePhotoURL) {
      profilePhotoURL = 'http://api.ioscreatix.com/default-profile-photo.png';
    }
    this.storageBrowser.set('cached_profile_photo_url', profilePhotoURL);
  }

  cacheDisplayName(identityProfile) {
    let profileDisplayNameData = identityProfile["displayName"];
    if (!profileDisplayNameData) {
      profileDisplayNameData = '';
      let nameData = identityProfile['name'];
      if (nameData['givenName']) {
        profileDisplayNameData = profileDisplayNameData + nameData['givenName'];
      }
      if (nameData['familyName']) {
        profileDisplayNameData = profileDisplayNameData + ' ' + nameData['familyName'];
      }
    }
    if (profileDisplayNameData) {
      this.storageBrowser.set('cached_profile_display_name', profileDisplayNameData);
    }
  }

  cacheProfileEmail(identityProfile) {
    let profileEmails = identityProfile["emails"];
    let profileEmail = '';
    if (profileEmails && profileEmails.length > 0) {
      profileEmail= profileEmails[0]["value"];
    }
    if (!profileEmail) {
      profileEmail = '';
    }
    this.storageBrowser.set('cached_profile_email', profileEmail);
  }

  transform(value) {
    if (value == "profile_photo_url") {
      let profilePhotoURL = this.storageBrowser.get('cached_profile_photo_url');
      if (profilePhotoURL) return profilePhotoURL;
      else {
        this.cacheProfileData();
        profilePhotoURL = this.storageBrowser.get('cached_profile_photo_url');
        return profilePhotoURL;
      }
    } else if (value == "profile_email") {
      let profileEmailAddress = this.storageBrowser.get('cached_profile_email');
      if (profileEmailAddress) return profileEmailAddress;
      else {
        this.cacheProfileData();
        profileEmailAddress = this.storageBrowser.get('cached_profile_email');
        return profileEmailAddress;
      }
    } else if (value == "profile_name") {
      let profileDisplayName = this.storageBrowser.get('cached_profile_display_name');
      if (profileDisplayName) return profileDisplayName;
      else {
        this.cacheProfileData();
        profileDisplayName = this.storageBrowser.get('cached_profile_display_name');
        return profileDisplayName;
      }
    } else {
      return '';
    }
  }
}
