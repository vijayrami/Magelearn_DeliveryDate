<?php
namespace Magelearn\DeliveryDate\Model;

use Magento\Checkout\Model\ConfigProviderInterface;
use Magelearn\DeliveryDate\Model\Config;

class DeliveryDateConfigProvider implements ConfigProviderInterface
{
    /**
     * @var \Magelearn\DeliveryDate\Model\Config
     */
    protected $config;

    /**
     * DeliveryDateConfigProvider constructor.
     *
     * @param Config $config
     */
    public function __construct(
        Config $config
    ) {
        $this->config = $config;
    }

    /**
     * {@inheritdoc}
     */
    public function getConfig()
    {
        return $this->config->getConfig();
    }
}