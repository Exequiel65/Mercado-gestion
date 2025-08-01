import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { Config } from './entities/config.entity';
import { plainToInstance } from 'class-transformer';
import { ReadSettingDto } from './dto/read-web-setting-dto';
import { CreateHomeDto } from './dto/create-home-setting.dto';
// import { HomeSetting } from './entities/home-setting.entity';
import { BannerGridDto, BannerGridItemDto, HomeBannerDto, HomeBannerImageDto, HomeButtonDto, HomeDto, HomeSectionDto } from './dto/read-home-setting.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Banner } from './entities/banner.entity';
import { Section } from './entities/section.entity';
import { BannerGrid } from './entities/bannerGrid.entity';
import { ItemBannerGrid } from './entities/ItemBannerGrid.entity';
import { Business } from './entities/business.entity';

@Injectable()
export class SettingsService {
	/**
	 *
	 */
	constructor(
		@InjectRepository(Config)
		private readonly configRepository: Repository<Config>,
		@InjectRepository(Banner)
		private readonly bannerRepository: Repository<Banner>,

		@InjectRepository(Section)
		private readonly sectionRepository: Repository<Section>,
		@InjectRepository(BannerGrid)
		private readonly bannerGridRepository: Repository<BannerGrid>,
		@InjectRepository(ItemBannerGrid)
		private readonly itemBannerGridRepository: Repository<ItemBannerGrid>,

		@InjectRepository(Business)
		private readonly businessRepository: Repository<Business>,
	) {


	}

	async findHomeSetting(entityId: number): Promise<HomeDto> {
		try {
			const [banners, sections, bannerGrid, gridItems] = await Promise.all([
				this.bannerRepository.find({ where: { entityId } }),
				this.sectionRepository.find( { where: { entityId}}),
				this.bannerGridRepository.findOne({ where: { entityId } }),
				this.itemBannerGridRepository.find({ where: { entityId }, order: { priority: 'ASC' } })
			]);

			return Object.assign(new HomeDto(), {
				banners: banners.map(b =>
					Object.assign(new HomeBannerDto(), {
						text: b.text,
						link: b.link,
						images: Object.assign(new HomeBannerImageDto(), {
							sm: b.sm,
							md: b.md,
							xl: b.xl,
						}),
					})
				),
				sections: sections.map(s =>
					Object.assign(new HomeSectionDto(), {
						section: s.sectionItem,
						endDate: s.endDate?.toISOString(),
						position: s.positionButton,
						title: s.title,
						showButtonSlider: s.showButtonSlider,
						secondLine: s.secondLine,
						button: Object.assign(new HomeButtonDto(), {
							text: s.textButton,
							path: s.linkButton,
							position: s.positionButton,
						}),
					})
				),
				bannerGrid: bannerGrid
					? Object.assign(new BannerGridDto(), {
						title: bannerGrid.title,
						items: gridItems.map(item =>
							Object.assign(new BannerGridItemDto(), {
								image: item.image,
								title: item.title,
								subtitle: item.subtitle,
								theme: item.theme,
								priority: item.priority,
								button: Object.assign(new HomeButtonDto(), {
									text: item.textButton,
									link: item.linkButton,
								}),
							})
						),
					})
					: null,
			});
		} catch (error) {
			console.error(error);
			throw new BadRequestException('Error finding home setting');
		}
	}

	async find(entityId: number): Promise<Config> {
		try {
			const setting = await this.configRepository.findOne({
				where: { entityId: entityId }
			});
			return setting ?? new Config();
		} catch (error) {
			console.log(error)
			throw new BadRequestException('Error finding setting');
		}
	}

	async findWeb(entityId:number): Promise<ReadSettingDto> {
		try {

			const [setting, business] = await Promise.all([
				await this.find(entityId),
				this.businessRepository.findOne({
					where: { entityId: entityId },
					relations: ['socialMedia']
				})]);
			const dto = plainToInstance(ReadSettingDto, {
				haveAuth: false,

				cart: {
					hasPaymentMethod: setting.hasPaymentMethod,
					redirectToWsp: setting.redirectToWsp,
					hasApplyCoupon: setting.hasApplyCoupon,
				},
				shipping: {
					enabled: setting.enabledShipping,
					hasFreeShipping: setting.hasFreeShipping,
					freeShippingMinAmount: setting.freeShippingAmount,
					title: setting.titleShipping,
					description: setting.descriptionShipping,
				},
				guaranteedDevolution: {
					enabled: setting.enabledDevolution,
					day: setting.devolutionDays,
					title: setting.titleDevolution,
					description: setting.descriptionDevolution,
				},
				hasSubscription: setting.hasSubscription,
				isMaintenance: setting.isMaintenance,

				company: {
					name: business?.name || '',
					address: business?.address || '',
					phone: business?.phonenumber || '',
					email: business?.email || '',
					googleMaps: business?.googleMapsUrl || '',
					iconUrl: business?.iconUrl || '',
					legendUrl: business?.legendUrl ? business.legendUrl.toISOString() : '',
					logoUrl: business?.logoUrl || '',
				},
				socialMedia: {
					instagram: business?.socialMedia?.instagram || '',
					facebook: business?.socialMedia?.facebook || '',
					twitter: business?.socialMedia?.twitter || '',
				},
			}, { excludeExtraneousValues: true });

			return dto;
		} catch (error) {
			throw new BadRequestException('Error finding setting');
		}
	}

}
