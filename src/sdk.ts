import { trackUser } from './utils/trackuser';
import { UserActionTrack } from './utils/trackuseraction';
import { verifyUser } from './utils/verifyuser';
import { verifyAccount } from './utils/verifyaccount';
import { trackScreen } from './utils/screen';
import Banner from './components/banner';
import Floater from './components/floater';
import Pip from './components/pip';
import Stories from './components/stories';
import {StoryScreen} from './components/storyscreen';

export type StoryGroup = {
  ringColor: string;
  thumbnail: string;
  name: string;
}

export type StoryGroupData = {
  ringColor: string;
  thumbnail: string;
  name: string;
}

export type CampaignFloater = {
  id: string,
  campaign_type: 'FLT',
  details: {
    id: string,
    image: string,
    link: string | null
  }
}

export type CampaignStory = {
  id: string,
  campaign_type: 'STR',
  details: [
    {
      id: string,
      name: string,
      thumbnail: string,
      ringColor: string,
      nameColor: string,
      order: number,
      slides: [
        {
          id: string,
          parent: string
          image: null | string,
          video: null | string,
          link: null | string,
          button_text: null | string,
          order: number;
          content: string | null
        }
      ]
    },
  ]
}

export type CampaignBanner = {
    id: string,
    campaign_type: 'BAN',
    details: {
      id: string,
      image: string,
      width: null | number,
      height: null | number,
      link: null | string,
    }
}

export type CampaignPip = {
  id: string
  campaign_type: 'PIP',
  details: {
    small_video: string,
    large_video: string,
    link: string | null,
    campaign: string,
    screen: number,
    redirectedTo: null | string
  }
}

export type UserData = {
    campaigns: Array<CampaignFloater | CampaignStory | CampaignBanner | CampaignPip>;
    user_id: string;
}

class AppStorys {

    private static instance: AppStorys;

    private campaigns: any[] = [];

    public static getInstance(): AppStorys {
        if (!AppStorys.instance) {
            AppStorys.instance = new AppStorys();
        }
        return AppStorys.instance;
    }

    public async trackScreen(app_id: string, screen_name: string) {
        this.campaigns = await trackScreen(app_id, screen_name);
        return this.campaigns;
    }
    public async trackUser(user_id: string, attributes?: any) {
        return await trackUser(user_id, attributes);
    }

    public async trackUserAction(user_id: string, campaign_id:string, action: any) {
        return await UserActionTrack(user_id, campaign_id, action);
    }

    public async verifyUser(user_id: string, attributes?: any): Promise<UserData | undefined> {
        return await verifyUser(user_id, this.campaigns, attributes);
    }

    public async verifyAccount(account_id: string, app_id: string) {
        return await verifyAccount(account_id, app_id);
    }

    public static Stories = Stories;
    public static StoryScreen = StoryScreen;
    public static Floater = Floater;
    public static Pip = Pip;
    public static Banner = Banner;

}

export default new AppStorys();
