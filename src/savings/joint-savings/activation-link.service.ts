import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivationLinkRepository } from './repository/activation-link.repository';
import { User } from '../../auth/entity/user.entity';
import { getExpiration, isExpired, md5 } from '../../common/utils';
import * as generate from 'meaningful-string';
import { ActivationLink } from './entity/activation-link.entity';
import { ExpiredActivationLinkException } from '../../exception/expired-activation-link.exception';
import { JointSavings } from './entity/joint-savings.entity';
import { ActivationLinkNotFoundException } from '../../exception/activation-link-not-found.exception';

@Injectable()
export class ActivationLinkService {
  private readonly logger = new Logger(ActivationLinkService.name, true);

  constructor(
    @InjectRepository(ActivationLinkRepository)
    private repository: ActivationLinkRepository,
  ) {}

  async getActivationLinks(users: User[], jointSavings: JointSavings) {
    this.logger.log(`Build token for ${jointSavings.groupName}`);

    const tokenArray = Array<string>();

    this.logger.log(`Create unique activation link for each participant`);

    for (const user of users) {
      const link = `${this.generateToken()}+${md5(
        jointSavings.groupName,
      )}`.toUpperCase();
      await this.repository.save({
        jointSavings,
        link,
        user,
        expires: getExpiration(30),
      });
      tokenArray.push(link);
    }

    return tokenArray;
  }

  generateToken() {
    this.logger.log(`Generate random token for link`);
    return generate.random({ min: 100, max: 100 });
  }

  async validateLink(user: User, link: string) {
    const activationLink = await this.repository.findOne({
      where: { link },
    });

    if (!activationLink) {
      this.logger.error(`Activation link not found`);
      throw new ActivationLinkNotFoundException();
    }

    if (isExpired(activationLink.expires)) {
      return new ExpiredActivationLinkException();
    }

    await this.deleteLink(activationLink);
  }

  async deleteLink(link: ActivationLink) {
    this.logger.log(`Delete activation link`);

    try {
      await this.repository.remove(link);
      this.logger.log(`Activation link deleted`);
    } catch (e) {
      this.logger.error(`Error occurred while deleting activation link`, e);
    }
  }
}
