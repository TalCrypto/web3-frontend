import React from 'react';
import Image from 'next/image';
import PageHeader from '@/components/layout/header/PageHeader';

export default function Terms() {
  return (
    <>
      <PageHeader
        title="Terms and Conditions"
        ogTitle="Start longing or shorting NFT collections with leverage."
        ogDesc="The most powerful Decentralized vAMM perpetual contract for trader to make a trade on NFT collection."
      />
      <div className="my-[8px] flex flex-row items-center justify-start space-x-3 px-[16px] text-[36px] font-[700] lg:p-0 ">
        <Image src="/icons/favicon.svg" width={32} height={32} alt="" />
        <span>Tribe3 T&Cs</span>
      </div>
      <div className="px-[16px] pb-[16px] pt-[20px] text-[14px] text-highEmphasis lg:px-0 lg:pt-[36px]">
        <div className="space-y-6 ">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Introduction
          </div>
          <div>
            These terms and conditions (&#34;Terms&#34;) set forth the agreement between Tribe3 (&#34;we,&#34; &#34;us,&#34; or
            &#34;Company&#34;) and you (&#34;User&#34; or &#34;you&#34;) regarding your use of the Tribe3 website and services. By accessing
            and using our website at{' '}
            <a href="https://tribe3.xyz" target="_blank" rel="noreferrer" className="text-primaryBlue underline">
              https://tribe3.xyz
            </a>{' '}
            and its subdomains (&#34;Website&#34;), as well as utilizing our Services, you acknowledge that you have read, understood, and
            agree to be bound by these Terms. Please note that our protocol is currently in the Beta phase, and its purpose is for testing
            and obtaining feedback. We do not provide any representations or warranties regarding the suitability or usability of the
            protocol, Services, Website, or content. Your use of the Beta protocol is at your own risk, and we shall not be liable for any
            loss incurred.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Interpretation and Definitions
          </div>
          <div>
            In these Terms, unless otherwise specified:
            <li>&#34;Tribe3&#34; refers to the Tribe3 platform and its operators.</li>
            <li>&#34;Protocol&#34; refers to the underlying technology and algorithms governing the Tribe3 platform.</li>
            <li>
              &#34;Digital Assets&#34; refers to cryptocurrencies, tokens, and other digital assets that are legally recognized and
              supported by the Tribe3 platform.
            </li>
            <li>
              &#34;Digital Wallet&#34; refers to the digital wallet which is provided by a compatible third-party wallet, intended for the
              storage and management of your Digital Assets.
            </li>
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Modifications to These Terms
          </div>
          <div>
            Tribe3 reserves the right to modify or update these Terms at any time without prior notice. Any changes will be effective
            immediately upon posting the updated Terms on the Tribe3 platform. It is your responsibility to review these Terms regularly. By
            continuing to use the Services after any modifications, you accept and agree to the updated Terms.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Protocol
          </div>
          <div>
            The Website serves as an interface for you to interact with the Protocol, a decentralized autonomous system deployed on various
            blockchain networks. The Protocol operates through smart contracts on these networks and functions in a decentralized and
            autonomous manner. Please note that we do not control or operate the Protocol. The information provided on the Website about the
            Protocol is for informational purposes only and does not form a part of these Terms. It is important that you carefully review
            and assess the functionality and security of the Protocol and related software before using them, as their use carries inherent
            risks. We recommend conducting your own research and understanding the implications before engaging with the Protocol.
          </div>
        </div>
        <div className="space-y-6 pt-[36px]">
          <div className="flex h-[24px] items-center text-[20px] font-[600]">
            <div className="mr-[8px] h-[100%] w-[4px] rounded-[30px] bg-primaryBlue" />
            Digital Assets
          </div>
          <div>
            Our Services revolve around Digital Assets, which are digital representations of value that exist on blockchain protocols
            through smart contracts. These Digital Assets derive their ownership rights and are recorded on the blockchain. Trading or
            dealing with Digital Assets carries risks, as outlined in the &#39;Risks&#39; section. It is crucial to be aware of and
            understand these risks before engaging in any activities involving Digital Assets.
          </div>
        </div>
      </div>
    </>
  );
}
